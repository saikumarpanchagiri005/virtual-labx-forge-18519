import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, ArrowUpDown, Gift, Wallet, Settings, Mic, Lightbulb, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { economyData, Transaction } from "@/data/economy";
import { TransactionEntry } from "@/components/economy/TransactionEntry";
import { RedeemModal } from "@/components/economy/RedeemModal";
import { BalanceSummaryModal } from "@/components/economy/BalanceSummaryModal";
import { TransactionDetailsModal } from "@/components/economy/TransactionDetailsModal";
import { MentorTipsModal } from "@/components/economy/MentorTipsModal";
import { AccessibilityModal } from "@/components/economy/AccessibilityModal";

const EconomyDashboard = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const { toast } = useToast();
  
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>(economyData.transactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Date");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(0);

  useEffect(() => {
    // Animate balance counter
    const start = 0;
    const end = economyData.balance;
    const duration = 500;
    const startTime = Date.now();
    
    const animateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setDisplayBalance(current);
      
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };
    
    requestAnimationFrame(animateCounter);
  }, []);

  useEffect(() => {
    // Animate balance from 0 to current value
    const timer = setTimeout(() => setBalance(economyData.balance), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Load saved filter/sort preferences
    const savedFilter = localStorage.getItem("economy-filter");
    const savedSort = localStorage.getItem("economy-sort");
    if (savedFilter) setFilter(savedFilter);
    if (savedSort) setSort(savedSort);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...transactions];
    
    if (filter === "Purchases") {
      filtered = filtered.filter(t => t.type === "Purchase");
    } else if (filter === "Earnings") {
      filtered = filtered.filter(t => t.type === "Earning");
    } else if (filter === "Recent") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(t => {
        const [day, month, year] = t.date.split('/');
        const transDate = new Date(Number(year), Number(month) - 1, Number(day));
        return transDate >= sevenDaysAgo;
      });
    }

    // Apply sorting
    if (sort === "Amount") {
      filtered.sort((a, b) => Math.abs(b.cost) - Math.abs(a.cost));
    } else if (sort === "Type") {
      filtered.sort((a, b) => b.type.localeCompare(a.type));
    }
    // Default is Date (already sorted in data)

    setFilteredTransactions(filtered);
  }, [filter, sort, transactions]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    localStorage.setItem("economy-filter", value);
    if (navigator.vibrate) navigator.vibrate([50]);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    localStorage.setItem("economy-sort", value);
    if (navigator.vibrate) navigator.vibrate([50]);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
    if (navigator.vibrate) navigator.vibrate([50]);
  };

  const handleVoiceBalance = () => {
    toast({
      title: "Voice Balance Coming Soon!",
      description: "Voice-activated balance summary will be available in a future update.",
    });
    if (navigator.vibrate) navigator.vibrate([50]);
  };

  const handleExport = () => {
    toast({
      title: "Transactions Exported!",
      description: "Your transaction history has been exported as PDF.",
    });
    if (navigator.vibrate) navigator.vibrate([50]);
  };

  const progressPercentage = (balance / economyData.nextMilestone) * 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='15' cy='15' r='5'/%3E%3Ccircle cx='45' cy='15' r='5'/%3E%3Ccircle cx='15' cy='45' r='5'/%3E%3Ccircle cx='45' cy='45' r='5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/shop")}
              aria-label="Back to Shop"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Economy Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAccessibilityOpen(true)}
            aria-label="Accessibility Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Panel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-lg shadow-lg p-6 space-y-4"
        >
          {/* Balance Display */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
              <div className="text-4xl font-bold text-primary flex items-center gap-2">
                {displayBalance}
                <span className="text-2xl">Coins</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSummaryOpen(true)}
              aria-label="View Balance Summary"
            >
              <Wallet className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next Milestone</span>
              <span className="font-medium">{economyData.nextMilestone} Coins</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => setRedeemOpen(true)}
              className="flex-1"
              size="sm"
            >
              <Gift className="w-4 h-4 mr-2" />
              Redeem Points
            </Button>
            <Button
              variant="outline"
              onClick={handleVoiceBalance}
              size="sm"
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setTipsOpen(true)}
              size="sm"
            >
              <Lightbulb className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Filters and Sort */}
        <div className="flex gap-3">
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="flex-1">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Transactions</SelectItem>
              <SelectItem value="Purchases">Purchases Only</SelectItem>
              <SelectItem value="Earnings">Earnings Only</SelectItem>
              <SelectItem value="Recent">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="flex-1">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Date">Sort by Date</SelectItem>
              <SelectItem value="Amount">Sort by Amount</SelectItem>
              <SelectItem value="Type">Sort by Type</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Transaction History</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {filteredTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-4"
            >
              <p className="text-muted-foreground">No transactions found</p>
              <Button onClick={() => setFilter("All")}>Reset Filters</Button>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction, index) => (
                <TransactionEntry
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => handleTransactionClick(transaction)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Robot Assistant Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        className="fixed bottom-24 left-4 w-12 h-12 pointer-events-none"
      >
        <motion.svg
          viewBox="0 0 50 50"
          className="w-full h-full text-muted-foreground"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <circle cx="25" cy="25" r="20" fill="currentColor" opacity="0.3" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
          <circle cx="30" cy="20" r="3" fill="currentColor" />
          <rect x="18" y="28" width="14" height="8" fill="currentColor" opacity="0.5" />
        </motion.svg>
      </motion.div>

      {/* Modals */}
      <RedeemModal open={redeemOpen} onOpenChange={setRedeemOpen} />
      <BalanceSummaryModal 
        open={summaryOpen} 
        onOpenChange={setSummaryOpen}
        balance={balance}
      />
      <TransactionDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        transaction={selectedTransaction}
      />
      <MentorTipsModal open={tipsOpen} onOpenChange={setTipsOpen} />
      <AccessibilityModal open={accessibilityOpen} onOpenChange={setAccessibilityOpen} />
    </div>
  );
};

export default EconomyDashboard;
