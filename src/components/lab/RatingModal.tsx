import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingModalProps {
  isOpen: boolean;
  labTitle: string;
  currentRating: number;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const RatingModal = ({
  isOpen,
  labTitle,
  currentRating,
  onClose,
  onSubmit,
}: RatingModalProps) => {
  const [selectedRating, setSelectedRating] = useState(Math.round(currentRating));
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if ('vibrate' in navigator) navigator.vibrate(100);
    onSubmit(selectedRating);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate This Lab</DialogTitle>
          <DialogDescription>{labTitle}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-125"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={cn(
                    "w-10 h-10 transition-all",
                    (hoverRating || selectedRating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {hoverRating || selectedRating} / 5
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Current rating: {currentRating.toFixed(1)}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Rating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
