import { SemaphoreState } from "@/types/threading";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SemaphoreVisualizerProps {
  semaphore: SemaphoreState;
  label: string;
}

export const SemaphoreVisualizer = ({ semaphore, label }: SemaphoreVisualizerProps) => {
  const isLocked = semaphore.value === 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold font-mono text-sync-semaphore">{label}</h3>
        <div
          className={cn(
            "p-3 rounded-lg transition-all duration-300",
            isLocked ? "bg-destructive/20 animate-pulse" : "bg-sync-semaphore/20"
          )}
        >
          {isLocked ? (
            <Lock className="w-5 h-5 text-destructive" />
          ) : (
            <Unlock className="w-5 h-5 text-sync-semaphore" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Counter */}
        <div className="bg-secondary rounded-lg p-4 text-center">
          <div className="text-sm text-muted-foreground font-mono mb-1">Counter Value</div>
          <div className="text-4xl font-bold font-mono text-primary">{semaphore.value}</div>
        </div>

        {/* Wait Queue */}
        <div>
          <div className="text-sm text-muted-foreground font-mono mb-2">
            Wait Queue ({semaphore.waitQueue.length})
          </div>
          <div className="bg-secondary rounded-lg p-3 min-h-[60px]">
            {semaphore.waitQueue.length === 0 ? (
              <div className="text-xs text-muted-foreground font-mono text-center py-2">
                No threads waiting
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {semaphore.waitQueue.map((threadId, index) => (
                  <div
                    key={threadId}
                    className="bg-thread-blocked/20 border border-thread-blocked text-thread-blocked px-2 py-1 rounded text-xs font-mono animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {threadId}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Operations Info */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-sync-semaphore/10 border border-sync-semaphore rounded-lg p-2">
            <div className="font-semibold text-sync-semaphore">P (wait)</div>
            <div className="text-muted-foreground mt-1">Decrements counter</div>
          </div>
          <div className="bg-sync-semaphore/10 border border-sync-semaphore rounded-lg p-2">
            <div className="font-semibold text-sync-semaphore">V (signal)</div>
            <div className="text-muted-foreground mt-1">Increments counter</div>
          </div>
        </div>
      </div>
    </div>
  );
};
