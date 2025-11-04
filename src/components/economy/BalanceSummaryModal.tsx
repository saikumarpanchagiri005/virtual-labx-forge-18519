import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wallet, TrendingUp, Award } from "lucide-react";

interface BalanceSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
}

export const BalanceSummaryModal = ({ open, onOpenChange, balance }: BalanceSummaryModalProps) => {
  const stats = [
    { label: "Current Balance", value: `${balance} Coins`, icon: Wallet, color: "text-primary" },
    { label: "Total Earned", value: "1,500 Coins", icon: TrendingUp, color: "text-green-600" },
    { label: "Total Spent", value: "250 Coins", icon: Award, color: "text-blue-600" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Balance Summary</DialogTitle>
          <DialogDescription>
            Your comprehensive coin statistics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-background ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-foreground">{stat.label}</span>
                </div>
                <span className={`text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Robot Highlight Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="absolute top-4 right-4 w-3 h-3"
        >
          <div className="w-full h-full rounded-full bg-primary animate-pulse" />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
