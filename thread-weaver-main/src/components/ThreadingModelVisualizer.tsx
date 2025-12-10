import { Thread, ThreadingModel } from "@/types/threading";
import { ThreadCard } from "./ThreadCard";
import { ArrowRight } from "lucide-react";

interface ThreadingModelVisualizerProps {
  model: ThreadingModel;
  userThreads: Thread[];
  kernelThreads: Thread[];
}

export const ThreadingModelVisualizer = ({
  model,
  userThreads,
  kernelThreads,
}: ThreadingModelVisualizerProps) => {
  const modelDescriptions = {
    "many-to-one": "Multiple user threads mapped to a single kernel thread. Simple but limited concurrency.",
    "one-to-many": "Single user thread can use multiple kernel threads. Rare in practice.",
    "many-to-many": "Multiple user threads mapped to multiple kernel threads. Maximum flexibility.",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold font-mono text-primary mb-2">
          {model.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-")} Model
        </h2>
        <p className="text-sm text-muted-foreground font-mono">{modelDescriptions[model]}</p>
      </div>

      <div className="grid grid-cols-3 gap-8 items-center">
        {/* User Threads */}
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-semibold text-accent text-center">
            User Threads
          </h3>
          <div className="space-y-2">
            {userThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} isCompact />
            ))}
          </div>
        </div>

        {/* Mapping Visualization */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <ArrowRight
                key={i}
                className="w-6 h-6 text-primary animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <div className="text-center">
            <div className="text-xs font-mono bg-primary/20 border border-primary rounded-lg px-3 py-2">
              <div className="font-semibold text-primary">Thread Mapping</div>
              <div className="text-muted-foreground mt-1">
                {userThreads.length}:{kernelThreads.length}
              </div>
            </div>
          </div>
        </div>

        {/* Kernel Threads */}
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-semibold text-primary text-center">
            Kernel Threads
          </h3>
          <div className="space-y-2">
            {kernelThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} isCompact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
