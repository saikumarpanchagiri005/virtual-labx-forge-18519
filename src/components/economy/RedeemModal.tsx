import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Coins } from "lucide-react";

interface RedeemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RedeemModal = ({ open, onOpenChange }: RedeemModalProps) => {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const redeemOptions = [
    { id: "1", coins: 50, points: 100, label: "50 Coins for 100 Points" },
    { id: "2", coins: 100, points: 250, label: "100 Coins for 250 Points" },
    { id: "3", coins: 250, points: 700, label: "250 Coins for 700 Points" },
  ];

  const handleRedeem = () => {
    if (!selectedOption) return;
    
    const option = redeemOptions.find(o => o.id === selectedOption);
    if (navigator.vibrate) navigator.vibrate([50]);
    
    toast({
      title: "Points Redeemed!",
      description: `Successfully redeemed ${option?.points} points for ${option?.coins} coins.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            Redeem Points
          </DialogTitle>
          <DialogDescription>
            Convert your points into coins for purchases
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {redeemOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Label
                htmlFor={option.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  id={option.id}
                  name="redeem"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="sr-only"
                />
                <span className="font-medium">{option.label}</span>
                <Coins className="w-5 h-5 text-primary" />
              </Label>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRedeem}
            disabled={!selectedOption}
            className="flex-1"
          >
            Redeem
          </Button>
        </div>

        {/* Robot Calculator Animation */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2 }}
          className="absolute bottom-4 right-4 w-12 h-12 opacity-20"
        >
          <svg viewBox="0 0 50 50" className="w-full h-full">
            <circle cx="25" cy="25" r="20" fill="currentColor" />
            <rect x="15" y="15" width="20" height="15" fill="white" opacity="0.5" />
          </svg>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
