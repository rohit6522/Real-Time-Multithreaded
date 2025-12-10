import { Thread, ThreadState } from "@/types/threading";
import { Cpu, Loader, Circle, XCircle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreadCardProps {
  thread: Thread;
  isCompact?: boolean;
}

const stateConfig: Record<ThreadState, { color: string; icon: JSX.Element; label: string }> = {
  new: {
    color: "bg-thread-new border-thread-new",
    icon: <Circle className="w-3 h-3" />,
    label: "New",
  },
  ready: {
    color: "bg-thread-ready border-thread-ready",
    icon: <Loader className="w-3 h-3" />,
    label: "Ready",
  },
  running: {
    color: "bg-thread-running border-thread-running animate-pulse-glow",
    icon: <Cpu className="w-3 h-3" />,
    label: "Running",
  },
  blocked: {
    color: "bg-thread-blocked border-thread-blocked",
    icon: <XCircle className="w-3 h-3" />,
    label: "Blocked",
  },
  terminated: {
    color: "bg-thread-terminated border-thread-terminated opacity-60",
    icon: <PlayCircle className="w-3 h-3" />,
    label: "Terminated",
  },
};

export const ThreadCard = ({ thread, isCompact = false }: ThreadCardProps) => {
  const config = stateConfig[thread.state];

  if (isCompact) {
    return (
      <div
        className={cn(
          "p-2 rounded-lg border-2 bg-card/50 backdrop-blur-sm transition-all duration-300 animate-scale-in",
          config.color
        )}
      >
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="text-xs font-mono font-semibold">{thread.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 rounded-xl border-2 bg-card backdrop-blur-sm transition-all duration-300 hover:scale-105 animate-scale-in",
        config.color
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="font-mono font-bold text-sm">{thread.name}</span>
        </div>
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-full font-mono border",
            thread.type === "kernel" ? "bg-primary/20 border-primary" : "bg-accent/20 border-accent"
          )}
        >
          {thread.type}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">State:</span>
          <span className="font-mono font-semibold">{config.label}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Priority:</span>
          <span className="font-mono">{thread.priority}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Exec Time:</span>
          <span className="font-mono">{thread.executionTime}ms</span>
        </div>
        {thread.mappedTo && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Mapped to:</span>
            <span className="font-mono text-primary">{thread.mappedTo}</span>
          </div>
        )}
      </div>
    </div>
  );
};
