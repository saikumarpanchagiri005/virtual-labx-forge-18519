import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface DifficultySliderbProps {
  value: number;
  onChange: (value: number) => void;
}

const difficultyLabels = ["Beginner", "Intermediate", "Advanced"];
const difficultyColors = [
  "bg-green-500/10 text-green-700 dark:text-green-400",
  "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  "bg-red-500/10 text-red-700 dark:text-red-400",
];

const DifficultySlider = ({ value, onChange }: DifficultySliderbProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Difficulty Level
        </label>
        <Badge variant="secondary" className={difficultyColors[value]}>
          {difficultyLabels[value]}
        </Badge>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={0}
        max={2}
        step={1}
        className="w-full"
        aria-label="Adjust difficulty level"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Beginner</span>
        <span>Intermediate</span>
        <span>Advanced</span>
      </div>
    </div>
  );
};

export default DifficultySlider;
