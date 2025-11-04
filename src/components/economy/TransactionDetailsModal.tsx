import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaction } from "@/data/economy";
import { Calendar, Tag, Coins } from "lucide-react";

interface TransactionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export const TransactionDetailsModal = ({ open, onOpenChange, transaction }: TransactionDetailsModalProps) => {
  if (!transaction) return null;

  const details = [
    { label: "Date", value: transaction.date, icon: Calendar },
    { label: "Category", value: transaction.category, icon: Tag },
    { label: "Amount", value: `${transaction.cost} Coins`, icon: Coins },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction.item}</DialogTitle>
          <DialogDescription>
            Transaction details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <motion.div
                key={detail.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg"
              >
                <Icon className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{detail.label}</p>
                  <p className="font-medium text-foreground">{detail.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Robot Laser Highlight Animation */}
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="absolute inset-0 pointer-events-none"
        >
          <svg className="w-full h-full">
            <motion.line
              x1="90%"
              y1="10%"
              x2="50%"
              y2="50%"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.3, delay: 0.4 }}
            />
          </svg>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
