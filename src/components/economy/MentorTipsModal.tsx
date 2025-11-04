import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lightbulb, Target, TrendingUp } from "lucide-react";

interface MentorTipsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MentorTipsModal = ({ open, onOpenChange }: MentorTipsModalProps) => {
  const tips = [
    {
      title: "Complete Lab Challenges",
      description: "Earn bonus coins by finishing labs with perfect scores",
      icon: Target,
    },
    {
      title: "Join Guild Activities",
      description: "Participate in guild events for team-based rewards",
      icon: TrendingUp,
    },
    {
      title: "Daily Login Streaks",
      description: "Log in daily to maintain your streak and earn bonus coins",
      icon: Lightbulb,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Mentor's Economy Tips
          </DialogTitle>
          <DialogDescription>
            Expert advice for maximizing your coin earnings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.3 }}
                className="flex gap-3 p-4 bg-accent/50 rounded-lg"
              >
                <div className="p-2 h-fit rounded-full bg-primary/20">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Robot Highlight Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="absolute bottom-4 right-4 w-16 h-16 pointer-events-none"
        >
          <svg viewBox="0 0 50 50" className="w-full h-full">
            <circle cx="25" cy="25" r="20" fill="currentColor" className="text-primary" />
            <circle cx="20" cy="20" r="3" fill="white" />
            <circle cx="30" cy="20" r="3" fill="white" />
            <path d="M 18 30 Q 25 35 32 30" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
