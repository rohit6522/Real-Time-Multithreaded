export type ThreadState = "new" | "ready" | "running" | "blocked" | "terminated";

export type ThreadingModel = "many-to-one" | "one-to-many" | "many-to-many";

export type SyncProblem = "producer-consumer" | "readers-writers" | "dining-philosophers" | "none";

export interface Thread {
  id: string;
  name: string;
  state: ThreadState;
  type: "user" | "kernel";
  mappedTo?: string; // For user threads mapped to kernel threads
  executionTime: number;
  priority: number;
}

export interface SemaphoreState {
  value: number;
  waitQueue: string[]; // Thread IDs
}

export interface SimulationEvent {
  id: string;
  timestamp: number;
  type: "thread_created" | "state_change" | "semaphore_wait" | "semaphore_signal" | "thread_mapped";
  threadId?: string;
  details: string;
}
