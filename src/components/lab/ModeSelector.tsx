import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Users } from "lucide-react";

interface ModeSelectorProps {
  value: "solo" | "team" | "";
  onChange: (value: "solo" | "team") => void;
}

const ModeSelector = ({ value, onChange }: ModeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        Lab Mode
        <span className="text-destructive">*</span>
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as "solo" | "team")}>
        <SelectTrigger
          className="w-full"
          aria-label="Select lab mode"
          aria-required="true"
        >
          <SelectValue placeholder="Choose mode..." />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          <SelectItem value="solo">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Solo Mode</span>
            </div>
          </SelectItem>
          <SelectItem value="team">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Team Mode</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModeSelector;
