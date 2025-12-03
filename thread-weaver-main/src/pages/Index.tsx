import { ControlPanel } from "@/components/ControlPanel";
import { ThreadingModelVisualizer } from "@/components/ThreadingModelVisualizer";
import { SemaphoreVisualizer } from "@/components/SemaphoreVisualizer";
import { EventLog } from "@/components/EventLog";
import { StatisticsPanel } from "@/components/StatisticsPanel";
import { useThreadSimulator } from "@/hooks/useThreadSimulator";
import { Cpu } from "lucide-react";

const Index = () => {
  const {
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
  } = useThreadSimulator();

  const allThreads = [...userThreads, ...kernelThreads];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/20 rounded-lg border border-primary">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Multithreading Simulator
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              Visualize threading models and synchronization mechanisms
            </p>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Control Panel */}
        <div className="col-span-3 space-y-6 animate-slide-in">
          <ControlPanel
            isRunning={isRunning}
            model={model}
            problem={problem}
            speed={speed}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onModelChange={setModel}
            onProblemChange={setProblem}
            onSpeedChange={setSpeed}
            onAddThread={handleAddThread}
          />

          <StatisticsPanel
            threads={allThreads}
            totalEvents={events.length}
            elapsedTime={elapsedTime}
          />
        </div>

        {/* Center Column - Visualization */}
        <div className="col-span-6 space-y-6 animate-scale-in" style={{ animationDelay: "100ms" }}>
          <ThreadingModelVisualizer
            model={model}
            userThreads={userThreads}
            kernelThreads={kernelThreads}
          />

          {problem !== "none" && (
            <SemaphoreVisualizer
              semaphore={semaphore}
              label={`${problem.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} Semaphore`}
            />
          )}
        </div>

        {/* Right Column - Event Log */}
        <div className="col-span-3 animate-slide-in" style={{ animationDelay: "200ms" }}>
          <EventLog events={events} />
        </div>
      </div>
    </div>
  );
};

export default Index;
