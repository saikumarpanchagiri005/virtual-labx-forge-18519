import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Transaction } from "@/data/economy";

interface TransactionEntryProps {
  transaction: Transaction;
  onClick: () => void;
  index: number;
}

export const TransactionEntry = ({ transaction, onClick, index }: TransactionEntryProps) => {
  const isEarning = transaction.type === "Earning";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-card hover:bg-accent/50 rounded-lg cursor-pointer transition-colors border border-border"
      role="button"
      tabIndex={0}
      aria-label={`Transaction: ${transaction.item}, ${transaction.cost} coins, ${transaction.date}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, y: isEarning ? [0, -10, 0] : [0, 10, 0] }}
          transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
          className={`p-2 rounded-full ${
            isEarning ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
          }`}
        >
          {isEarning ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        </motion.div>
        
        <div className="flex-1">
          <p className="font-medium text-foreground">{transaction.item}</p>
          <p className="text-sm text-muted-foreground">{transaction.date} • {transaction.category}</p>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 + 0.3 }}
        className={`text-lg font-bold ${
          isEarning ? "text-green-600" : "text-red-600"
        }`}
      >
        {isEarning ? "+" : ""}{transaction.cost}
      </motion.div>
    </motion.div>
  );
};
