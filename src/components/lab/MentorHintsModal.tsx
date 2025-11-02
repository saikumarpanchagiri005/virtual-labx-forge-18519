import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lightbulb } from "lucide-react";

interface MentorHintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  labTitle: string;
}

const MentorHintsModal = ({ isOpen, onClose, labTitle }: MentorHintsModalProps) => {
  const hints = [
    "Start with the lowest voltage settings to avoid damaging components",
    "Always double-check your connections before powering on the circuit",
    "Use the voltmeter to measure voltage drops across resistors",
    "Remember to calculate theoretical values before testing experimentally",
    "Take notes of your measurements for analysis later",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Mentor Hints
          </DialogTitle>
          <DialogDescription>{labTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {hints.map((hint, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 bg-muted/50 rounded-lg animate-vlx-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {index + 1}
              </div>
              <p className="text-sm text-foreground">{hint}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MentorHintsModal;
