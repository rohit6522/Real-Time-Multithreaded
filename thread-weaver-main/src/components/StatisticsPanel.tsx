import { Thread } from "@/types/threading";
import { Activity, Cpu, Clock, Layers } from "lucide-react";

interface StatisticsPanelProps {
  threads: Thread[];
  totalEvents: number;
  elapsedTime: number;
}

export const StatisticsPanel = ({ threads, totalEvents, elapsedTime }: StatisticsPanelProps) => {
  const runningThreads = threads.filter((t) => t.state === "running").length;
  const readyThreads = threads.filter((t) => t.state === "ready").length;
  const blockedThreads = threads.filter((t) => t.state === "blocked").length;
  const totalThreads = threads.length;

  const stats = [
    {
      label: "Running",
      value: runningThreads,
      icon: <Cpu className="w-4 h-4" />,
      color: "text-thread-running",
    },
    {
      label: "Ready",
      value: readyThreads,
      icon: <Activity className="w-4 h-4" />,
      color: "text-thread-ready",
    },
    {
      label: "Blocked",
      value: blockedThreads,
      icon: <Clock className="w-4 h-4" />,
      color: "text-thread-blocked",
    },
    {
      label: "Total",
      value: totalThreads,
      icon: <Layers className="w-4 h-4" />,
      color: "text-primary",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 font-mono text-primary">Statistics</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-secondary/50 border border-border rounded-lg p-4 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-xs font-mono text-muted-foreground">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="bg-secondary/50 border border-border rounded-lg p-3">
          <div className="text-xs font-mono text-muted-foreground mb-1">Total Events</div>
          <div className="text-xl font-bold font-mono text-foreground">{totalEvents}</div>
        </div>

        <div className="bg-secondary/50 border border-border rounded-lg p-3">
          <div className="text-xs font-mono text-muted-foreground mb-1">Elapsed Time</div>
          <div className="text-xl font-bold font-mono text-foreground">
            {(elapsedTime / 1000).toFixed(2)}s
          </div>
        </div>
      </div>
    </div>
  );
};
