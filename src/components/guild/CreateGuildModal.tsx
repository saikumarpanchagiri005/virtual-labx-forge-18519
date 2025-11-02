import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";
import { focusOptions } from "@/data/guilds";

interface CreateGuildModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, focus: string) => void;
}

const CreateGuildModal = ({ open, onOpenChange, onCreate }: CreateGuildModalProps) => {
  const [guildName, setGuildName] = useState("");
  const [guildFocus, setGuildFocus] = useState("ECE");
  const [showBadgeAssembly, setShowBadgeAssembly] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guildName.trim()) return;
    
    setShowBadgeAssembly(true);
    setTimeout(() => {
      onCreate(guildName, guildFocus);
      setGuildName("");
      setGuildFocus("ECE");
      setShowBadgeAssembly(false);
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-vlx-slide-up">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Create New Guild
          </DialogTitle>
          <DialogDescription>
            Start your own collaborative team for lab work
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Guild Name */}
          <div className="space-y-2">
            <Label htmlFor="guild-name">Guild Name</Label>
            <Input
              id="guild-name"
              placeholder="e.g., ECE Innovators"
              value={guildName}
              onChange={(e) => setGuildName(e.target.value)}
              required
              aria-label="Guild name input"
            />
          </div>

          {/* Guild Focus */}
          <div className="space-y-2">
            <Label htmlFor="guild-focus">Focus Area</Label>
            <Select value={guildFocus} onValueChange={setGuildFocus}>
              <SelectTrigger id="guild-focus" aria-label="Guild focus selection">
                <SelectValue placeholder="Select focus area" />
              </SelectTrigger>
              <SelectContent>
                {focusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Badge Assembly Animation */}
          {showBadgeAssembly && (
            <div className="relative h-24 flex items-center justify-center">
              <div className="relative">
                {/* Particle dots converging to center */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-primary"
                    style={{
                      animation: `vlx-particle-converge 0.5s ease-out`,
                      left: `${Math.cos((i * Math.PI) / 4) * 40}px`,
                      top: `${Math.sin((i * Math.PI) / 4) * 40}px`,
                    }}
                  />
                ))}
                {/* Shield badge forming */}
                <Shield
                  className="h-12 w-12 text-primary"
                  style={{
                    animation: "vlx-badge-form 0.5s ease-out",
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={!guildName.trim()}>
            Create Guild
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGuildModal;
