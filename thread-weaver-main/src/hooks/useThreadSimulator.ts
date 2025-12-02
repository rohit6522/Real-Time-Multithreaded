import { useState, useCallback, useEffect, useRef } from "react";
import { Thread, ThreadState, ThreadingModel, SyncProblem, SemaphoreState, SimulationEvent } from "@/types/threading";
import { toast } from "sonner";

export const useThreadSimulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [model, setModel] = useState<ThreadingModel>("many-to-many");
  const [problem, setProblem] = useState<SyncProblem>("none");
  const [speed, setSpeed] = useState(1);
  const [userThreads, setUserThreads] = useState<Thread[]>([]);
  const [kernelThreads, setKernelThreads] = useState<Thread[]>([]);
  const [semaphore, setSemaphore] = useState<SemaphoreState>({ value: 3, waitQueue: [] });
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize threads based on model
  const initializeThreads = useCallback(() => {
    const createThread = (id: string, name: string, type: "user" | "kernel"): Thread => ({
      id,
      name,
      state: "ready",
      type,
      executionTime: Math.floor(Math.random() * 500) + 100,
      priority: Math.floor(Math.random() * 10) + 1,
    });

    let newUserThreads: Thread[] = [];
    let newKernelThreads: Thread[] = [];

    switch (model) {
      case "many-to-one":
        newUserThreads = [
          createThread("u1", "UT-1", "user"),
          createThread("u2", "UT-2", "user"),
          createThread("u3", "UT-3", "user"),
          createThread("u4", "UT-4", "user"),
        ];
        newKernelThreads = [createThread("k1", "KT-1", "kernel")];
        newUserThreads.forEach(t => t.mappedTo = "KT-1");
        break;

      case "one-to-many":
        newUserThreads = [createThread("u1", "UT-1", "user")];
        newKernelThreads = [
          createThread("k1", "KT-1", "kernel"),
          createThread("k2", "KT-2", "kernel"),
          createThread("k3", "KT-3", "kernel"),
        ];
        newUserThreads[0].mappedTo = "KT-1,KT-2,KT-3";
        break;

      case "many-to-many":
        newUserThreads = [
          createThread("u1", "UT-1", "user"),
          createThread("u2", "UT-2", "user"),
          createThread("u3", "UT-3", "user"),
          createThread("u4", "UT-4", "user"),
        ];
        newKernelThreads = [
          createThread("k1", "KT-1", "kernel"),
          createThread("k2", "KT-2", "kernel"),
        ];
        newUserThreads[0].mappedTo = "KT-1";
        newUserThreads[1].mappedTo = "KT-1";
        newUserThreads[2].mappedTo = "KT-2";
        newUserThreads[3].mappedTo = "KT-2";
        break;
    }

    setUserThreads(newUserThreads);
    setKernelThreads(newKernelThreads);

    addEvent("thread_created", undefined, `Initialized ${model} threading model with ${newUserThreads.length} user threads and ${newKernelThreads.length} kernel threads`);
  }, [model]);

  // Add event to log
  const addEvent = useCallback((type: SimulationEvent["type"], threadId: string | undefined, details: string) => {
    const event: SimulationEvent = {
      id: `event-${Date.now()}-${Math.random()}`,
      timestamp: Date.now() - startTimeRef.current,
      type,
      threadId,
      details,
    };
    setEvents((prev) => [event, ...prev].slice(0, 100)); // Keep last 100 events
  }, []);

  // Update thread state
  const updateThreadState = useCallback((threadId: string, newState: ThreadState, isUser: boolean) => {
    const setter = isUser ? setUserThreads : setKernelThreads;
    setter((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          addEvent("state_change", threadId, `${t.name} changed state: ${t.state} → ${newState}`);
          return { ...t, state: newState };
        }
        return t;
      })
    );
  }, [addEvent]);

  // Simulation tick
  const simulationTick = useCallback(() => {
    // Randomly change thread states
    const allThreads = [...userThreads, ...kernelThreads];
    const activeThreads = allThreads.filter(t => t.state !== "terminated");
    
    if (activeThreads.length === 0) return;

    const randomThread = activeThreads[Math.floor(Math.random() * activeThreads.length)];
    const isUser = randomThread.type === "user";

    // State transitions
    const transitions: Record<ThreadState, ThreadState[]> = {
      new: ["ready"],
      ready: ["running", "ready"],
      running: ["ready", "blocked", "terminated"],
      blocked: ["ready"],
      terminated: ["terminated"],
    };

    const possibleStates = transitions[randomThread.state];
    const newState = possibleStates[Math.floor(Math.random() * possibleStates.length)];

    updateThreadState(randomThread.id, newState, isUser);

    // Semaphore operations
    if (problem === "producer-consumer" && Math.random() > 0.7) {
      if (randomThread.state === "running" && semaphore.value > 0) {
        setSemaphore(prev => ({
          value: prev.value - 1,
          waitQueue: prev.waitQueue,
        }));
        addEvent("semaphore_wait", randomThread.id, `${randomThread.name} executed P(wait) - semaphore: ${semaphore.value - 1}`);
      } else if (Math.random() > 0.5) {
        setSemaphore(prev => ({
          value: prev.value + 1,
          waitQueue: prev.waitQueue,
        }));
        addEvent("semaphore_signal", randomThread.id, `${randomThread.name} executed V(signal) - semaphore: ${semaphore.value + 1}`);
      }
    }
  }, [userThreads, kernelThreads, problem, semaphore, updateThreadState, addEvent]);

  // Control functions
  const handlePlayPause = useCallback(() => {
    setIsRunning((prev) => {
      const newState = !prev;
      toast(newState ? "Simulation started" : "Simulation paused");
      if (newState) {
        startTimeRef.current = Date.now() - elapsedTime;
      }
      return newState;
    });
  }, [elapsedTime]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setEvents([]);
    setElapsedTime(0);
    setSemaphore({ value: 3, waitQueue: [] });
    initializeThreads();
    toast("Simulation reset");
  }, [initializeThreads]);

  const handleAddThread = useCallback(() => {
    const newId = `u${userThreads.length + 1}`;
    const newThread: Thread = {
      id: newId,
      name: `UT-${userThreads.length + 1}`,
      state: "new",
      type: "user",
      executionTime: Math.floor(Math.random() * 500) + 100,
      priority: Math.floor(Math.random() * 10) + 1,
      mappedTo: kernelThreads[0]?.name,
    };
    setUserThreads((prev) => [...prev, newThread]);
    addEvent("thread_created", newId, `Created new user thread: ${newThread.name}`);
    toast.success(`Thread ${newThread.name} created`);
  }, [userThreads, kernelThreads, addEvent]);

  // Initialize on mount
  useEffect(() => {
    initializeThreads();
  }, [initializeThreads]);

  // Simulation loop
  useEffect(() => {
    if (isRunning) {
      const tickDuration = 1000 / speed;
      intervalRef.current = setInterval(() => {
        simulationTick();
        setElapsedTime(Date.now() - startTimeRef.current);
      }, tickDuration);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, simulationTick]);

  return {
    isRunning,
    model,
    problem,
    speed,
    userThreads,
    kernelThreads,
    semaphore,
    events,
    elapsedTime,
    setModel,
    setProblem,
    setSpeed,
    handlePlayPause,
    handleReset,
    handleAddThread,
  };
};
