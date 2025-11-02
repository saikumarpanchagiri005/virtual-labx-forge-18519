import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Lightbulb } from "lucide-react";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: string;
  improvements: string[];
  strengths: string[];
}

const FeedbackModal = ({
  open,
  onOpenChange,
  feedback,
  improvements,
  strengths,
}: FeedbackModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Detailed Feedback
          </DialogTitle>
          <DialogDescription>
            Expert analysis of your experiment performance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall feedback */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-foreground">{feedback}</p>
          </div>

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                What You Did Well
              </h3>
              <div className="space-y-2">
                {strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 animate-vlx-scale"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <p className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>{strength}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Areas for improvement */}
          {improvements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                Areas to Improve
              </h3>
              <div className="space-y-2">
                {improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30 animate-vlx-scale relative"
                    style={{ animationDelay: `${(strengths.length + index) * 100}ms` }}
                  >
                    <p className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-yellow-500 font-bold">!</span>
                      <span>{improvement}</span>
                    </p>
                    
                    {/* Laser pointer from robot */}
                    {index === 0 && (
                      <div
                        className="absolute -left-8 top-1/2 w-8 h-0.5 bg-primary/50"
                        style={{
                          animation: "vlx-laser-point 1.5s ease-in-out infinite",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          <Button
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
