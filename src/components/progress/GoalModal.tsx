import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Calendar, Hash, Save } from "lucide-react";
import { Goal } from "@/data/progressData";
import { useToast } from "@/hooks/use-toast";

interface GoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveGoal: (goal: Omit<Goal, "id" | "currentProgress" | "isCompleted">) => void;
}

const GoalModal = ({ open, onOpenChange, onSaveGoal }: GoalModalProps) => {
  const { toast } = useToast();
  const [robotWriting, setRobotWriting] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    targetDate: "",
    targetLabs: "",
  });

  useEffect(() => {
    if (open) {
      setRobotWriting(true);
      setTimeout(() => setRobotWriting(false), 400);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.targetDate || !formData.targetLabs) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields to set a goal.",
        variant: "destructive",
      });
      return;
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }

    onSaveGoal({
      description: formData.description,
      targetDate: formData.targetDate,
      targetLabs: parseInt(formData.targetLabs),
    });

    toast({
      title: "Goal saved! 🎯",
      description: "Your learning goal has been recorded.",
    });

    setFormData({ description: "", targetDate: "", targetLabs: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Set Learning Goal
          </DialogTitle>
          <DialogDescription>
            Define your learning objectives to stay motivated
          </DialogDescription>
        </DialogHeader>

        {/* Robot writing animation */}
        <div className="relative h-12 mb-2 flex items-center justify-center">
          <div
            className={`transition-transform duration-400 ${
              robotWriting ? "translate-x-2" : "translate-x-0"
            }`}
          >
            <div className="text-4xl">🤖</div>
          </div>
          <div
            className={`absolute right-8 transition-opacity duration-300 ${
              robotWriting ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="text-2xl">📋</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-description" className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Goal Description
            </Label>
            <Input
              id="goal-description"
              placeholder="e.g., Complete 5 ECE labs"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              aria-label="Goal description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Target Date
            </Label>
            <Input
              id="target-date"
              type="date"
              value={formData.targetDate}
              onChange={(e) =>
                setFormData({ ...formData, targetDate: e.target.value })
              }
              aria-label="Target completion date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-labs" className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              Number of Labs
            </Label>
            <Input
              id="target-labs"
              type="number"
              min="1"
              placeholder="e.g., 5"
              value={formData.targetLabs}
              onChange={(e) =>
                setFormData({ ...formData, targetLabs: e.target.value })
              }
              aria-label="Target number of labs"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalModal;
