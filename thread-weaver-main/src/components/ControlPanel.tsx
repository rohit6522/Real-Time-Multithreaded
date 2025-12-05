import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Plus } from "lucide-react";
import { ThreadingModel, SyncProblem } from "@/types/threading";

interface ControlPanelProps {
  isRunning: boolean;
  model: ThreadingModel;
  problem: SyncProblem;
  speed: number;
  onPlayPause: () => void;
  onReset: () => void;
  onModelChange: (model: ThreadingModel) => void;
  onProblemChange: (problem: SyncProblem) => void;
  onSpeedChange: (speed: number) => void;
  onAddThread: () => void;
}

export const ControlPanel = ({
  isRunning,
  model,
  problem,
  speed,
  onPlayPause,
  onReset,
  onModelChange,
  onProblemChange,
  onSpeedChange,
  onAddThread,
}: ControlPanelProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 font-mono text-primary">Control Panel</h2>
        
        <div className="space-y-4">
          {/* Threading Model */}
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Threading Model
            </label>
            <Select value={model} onValueChange={onModelChange}>
              <SelectTrigger className="font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="many-to-one" className="font-mono">
                  Many-to-One
                </SelectItem>
                <SelectItem value="one-to-many" className="font-mono">
                  One-to-Many
                </SelectItem>
                <SelectItem value="many-to-many" className="font-mono">
                  Many-to-Many
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sync Problem */}
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Synchronization Problem
            </label>
            <Select value={problem} onValueChange={onProblemChange}>
              <SelectTrigger className="font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="font-mono">
                  None
                </SelectItem>
                <SelectItem value="producer-consumer" className="font-mono">
                  Producer-Consumer
                </SelectItem>
                <SelectItem value="readers-writers" className="font-mono">
                  Readers-Writers
                </SelectItem>
                <SelectItem value="dining-philosophers" className="font-mono">
                  Dining Philosophers
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Speed Control */}
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Simulation Speed: {speed}x
            </label>
            <Slider
              value={[speed]}
              onValueChange={(values) => onSpeedChange(values[0])}
              min={0.5}
              max={3}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onPlayPause}
          variant={isRunning ? "destructive" : "default"}
          className="font-mono"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start
            </>
          )}
        </Button>
        
        <Button onClick={onReset} variant="secondary" className="font-mono">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        
        <Button onClick={onAddThread} variant="outline" className="col-span-2 font-mono">
          <Plus className="w-4 h-4 mr-2" />
          Add Thread
        </Button>
      </div>
    </div>
  );
};
