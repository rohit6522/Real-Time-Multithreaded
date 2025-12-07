import { SimulationEvent } from "@/types/threading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";

interface EventLogProps {
  events: SimulationEvent[];
}

export const EventLog = ({ events }: EventLogProps) => {
  const formatTimestamp = (timestamp: number) => {
    return `${(timestamp / 1000).toFixed(2)}s`;
  };

  const getEventColor = (type: SimulationEvent["type"]) => {
    switch (type) {
      case "thread_created":
        return "text-thread-new";
      case "state_change":
        return "text-primary";
      case "semaphore_wait":
        return "text-thread-blocked";
      case "semaphore_signal":
        return "text-thread-running";
      case "thread_mapped":
        return "text-accent";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold font-mono text-primary">Event Log</h2>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground font-mono text-sm">
              No events yet. Start the simulation to see activity.
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-secondary/50 border border-border rounded-lg p-3 animate-slide-in hover:bg-secondary transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </span>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded ${getEventColor(
                          event.type
                        )} bg-current/10`}
                      >
                        {event.type.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-mono">{event.details}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
