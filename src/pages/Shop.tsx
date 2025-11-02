import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Coins, ShoppingCart, Mic, Sparkles, Settings, History, X, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: "tool" | "badge" | "boost";
  description: string;
  isDailyDeal?: boolean;
  isPurchased?: boolean;
}

const mockItems: ShopItem[] = [
  { id: "item-001", name: "Voltmeter Skin", price: 50, type: "tool", description: "Premium digital voltmeter appearance" },
  { id: "item-002", name: "Gold Badge", price: 100, type: "badge", description: "Show your expertise", isDailyDeal: true },
  { id: "item-003", name: "XP Boost 2x", price: 75, type: "boost", description: "Double XP for 24 hours" },
  { id: "item-004", name: "Oscilloscope Theme", price: 60, type: "tool", description: "Retro green screen look" },
  { id: "item-005", name: "Platinum Badge", price: 150, type: "badge", description: "Elite member status" },
  { id: "item-006", name: "Lab Coat Skin", price: 80, type: "tool", description: "Professional lab attire" },
  { id: "item-007", name: "Speed Boost 3x", price: 120, type: "boost", description: "Triple speed for challenges" },
  { id: "item-008", name: "Diamond Badge", price: 200, type: "badge", description: "Legendary achievement" },
  { id: "item-009", name: "Microscope Skin", price: 70, type: "tool", description: "Enhanced microscope visuals" },
  { id: "item-010", name: "Safety Goggles", price: 40, type: "tool", description: "Stylish protective eyewear" },
  { id: "item-011", name: "Team Badge", price: 90, type: "badge", description: "Collaboration champion" },
  { id: "item-012", name: "Coin Multiplier", price: 110, type: "boost", description: "Earn 50% more coins" },
  { id: "item-013", name: "Beaker Collection", price: 85, type: "tool", description: "Set of premium beakers" },
  { id: "item-014", name: "Mentor Badge", price: 130, type: "badge", description: "Help others, get recognized" },
  { id: "item-015", name: "Lab Timer Pro", price: 55, type: "tool", description: "Advanced timing features" },
];

const Shop = () => {
  const { toast } = useToast();
  
  const [items, setItems] = useState<ShopItem[]>(mockItems);
  const [filteredItems, setFilteredItems] = useState<ShopItem[]>(mockItems);
  const [filterBy, setFilterBy] = useState("All");
  const [sortBy, setSortBy] = useState("Price");
  const [showRedeemCode, setShowRedeemCode] = useState(false);
  const [showItemPreview, setShowItemPreview] = useState(false);
  const [showCoinHistory, setShowCoinHistory] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [redeemCode, setRedeemCode] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(1);
  const [robotState, setRobotState] = useState<"idle" | "scanning" | "tossing">("idle");
  const [coinBalance, setCoinBalance] = useState(1250);

  useState(() => {
    let filtered = items;
    
    if (filterBy !== "All") {
      const filterType = filterBy.toLowerCase() as "tool" | "badge" | "boost";
      filtered = filtered.filter(i => i.type === filterType);
    }

    if (sortBy === "Price") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Popularity") {
      filtered = [...filtered].sort((a, b) => b.price - a.price); // Mock popularity by price
    }

    setFilteredItems(filtered);
  });

  const triggerHaptic = () => {
    if (navigator.vibrate && hapticIntensity > 0) {
      navigator.vibrate([50 * hapticIntensity]);
    }
  };

  const handlePurchase = (item: ShopItem) => {
    if (coinBalance >= item.price) {
      triggerHaptic();
      setRobotState("tossing");
      setCoinBalance(coinBalance - item.price);
      const updatedItems = items.map(i => i.id === item.id ? { ...i, isPurchased: true } : i);
      setItems(updatedItems);
      setFilteredItems(updatedItems.filter(i => filterBy === "All" || i.type === filterBy.toLowerCase()));
      toast({ title: "Item Unlocked!", description: `${item.name} added to your inventory` });
      setTimeout(() => setRobotState("idle"), 1000);
    } else {
      toast({ title: "Insufficient Coins", description: "Earn more coins to purchase this item", variant: "destructive" });
    }
  };

  const handleFilterChange = (value: string) => {
    triggerHaptic();
    setFilterBy(value);
    setRobotState("scanning");
    setTimeout(() => setRobotState("idle"), 800);
  };

  const handleRedeemCode = () => {
    triggerHaptic();
    if (redeemCode) {
      toast({ title: "Code Redeemed!", description: "Bonus coins added to your balance" });
      setCoinBalance(coinBalance + 100);
      setRedeemCode("");
      setShowRedeemCode(false);
    }
  };

  const handleVoiceShop = () => {
    triggerHaptic();
    toast({ title: "Voice Shop", description: "Voice shop coming soon!" });
  };

  const handleMentorDeals = () => {
    triggerHaptic();
    toast({ title: "Mentor Deals", description: "Opening personalized deals..." });
  };

  return (
    <div className="min-h-screen bg-background relative" style={{ fontSize: `${fontSize}px` }}>
      <div className="container max-w-6xl py-8 px-4 space-y-6">
        {/* Header */}
        <div className="space-y-2 vlx-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold relative inline-block">
                Lab Shop
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-[scale-in_0.3s_ease-out]" />
              </h1>
              <p className="text-muted-foreground mt-1">Upgrade your virtual lab experience</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xl font-bold animate-vlx-pulse">
                <Coins className="h-6 w-6 text-primary" />
                {coinBalance}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAccessibility(true)} aria-label="Accessibility settings">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Robot Assistant */}
        <div className={`fixed top-24 left-4 z-40 transition-transform duration-300 ${robotState === "scanning" ? "animate-vlx-bounce" : ""}`}>
          <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary flex items-center justify-center`}>
            <ShoppingCart className={`h-6 w-6 text-primary ${robotState === "scanning" ? "animate-vlx-spin" : ""}`} />
          </div>
          {robotState === "tossing" && (
            <div className="absolute top-0 left-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-500 rounded-full"
                  style={{
                    animation: `coin-burst 0.5s ease-out ${i * 0.1}s`,
                    left: "50%",
                    top: "50%"
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-end vlx-slide-up">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="filter">Filter By</Label>
            <Select value={filterBy} onValueChange={handleFilterChange}>
              <SelectTrigger id="filter" aria-label="Filter items">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Tools">Tools</SelectItem>
                <SelectItem value="Badges">Badges</SelectItem>
                <SelectItem value="Boost">Boosts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="sort">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort" aria-label="Sort items">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Price">Price</SelectItem>
                <SelectItem value="Popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 vlx-slide-up" style={{ animationDelay: "0.1s" }}>
          <Button variant="outline" onClick={() => setShowRedeemCode(true)}>
            <Zap className="mr-2 h-4 w-4" />
            Redeem Code
          </Button>
          <Button variant="outline" onClick={() => setShowCoinHistory(true)}>
            <History className="mr-2 h-4 w-4" />
            Coin History
          </Button>
          <Button variant="outline" onClick={handleVoiceShop}>
            <Mic className="mr-2 h-4 w-4" />
            Voice Shop
          </Button>
          <Button variant="outline" onClick={handleMentorDeals}>
            <Sparkles className="mr-2 h-4 w-4" />
            Mentor Deals
          </Button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="p-6 hover:shadow-lg transition-all duration-300 vlx-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {item.isDailyDeal && (
                <Badge className="absolute top-2 right-2 bg-orange-500 animate-vlx-pulse">
                  Daily Deal
                </Badge>
              )}
              {item.isPurchased && (
                <Badge className="absolute top-2 right-2 bg-green-500 animate-[spin_0.3s_ease-out]">
                  Unlocked
                </Badge>
              )}
              
              <div className="space-y-4">
                <div
                  className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center relative overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowItemPreview(true);
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[shine_2s_ease-in-out_infinite]" style={{ transform: "skewX(-20deg)" }} />
                  <ShoppingCart className="h-12 w-12 text-primary relative z-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  
                  <Badge variant="secondary" className="capitalize">{item.type}</Badge>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-xl font-bold text-primary">
                      <Coins className="h-5 w-5" />
                      {item.price}
                    </div>
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={item.isPurchased || coinBalance < item.price}
                    >
                      {item.isPurchased ? "Owned" : "Buy"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Redeem Code Modal */}
      <Dialog open={showRedeemCode} onOpenChange={setShowRedeemCode}>
        <DialogContent className="max-w-md" aria-describedby="redeem-description">
          <DialogHeader>
            <DialogTitle>Redeem Code</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:shadow-[0_0_8px_rgba(0,123,255,0.6)] active:rotate-45"
              onClick={() => setShowRedeemCode(false)}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4" id="redeem-description">
            <div className="space-y-2">
              <Label htmlFor="code">Enter Code</Label>
              <Input
                id="code"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                placeholder="XXXXX-XXXXX"
                aria-label="Redeem code input"
              />
            </div>
            <Button className="w-full" onClick={handleRedeemCode} disabled={!redeemCode}>
              Redeem
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Preview Modal */}
      <Dialog open={showItemPreview} onOpenChange={setShowItemPreview}>
        <DialogContent className="max-w-md" aria-describedby="preview-description">
          <DialogHeader>
            <DialogTitle>Item Preview</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:shadow-[0_0_8px_rgba(0,123,255,0.6)] active:rotate-45"
              onClick={() => setShowItemPreview(false)}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4" id="preview-description">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-24 w-24 text-primary animate-vlx-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">{selectedItem.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Coin History Modal */}
      <Dialog open={showCoinHistory} onOpenChange={setShowCoinHistory}>
        <DialogContent className="max-w-md" aria-describedby="history-description">
          <DialogHeader>
            <DialogTitle>Coin History</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:shadow-[0_0_8px_rgba(0,123,255,0.6)] active:rotate-45"
              onClick={() => setShowCoinHistory(false)}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-3" id="history-description">
            {[
              { action: "Lab Completed", amount: 50, date: "02/11/2025" },
              { action: "Challenge Won", amount: 75, date: "01/11/2025" },
              { action: "Daily Login", amount: 25, date: "31/10/2025" },
            ].map((transaction, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div>
                  <p className="font-medium">{transaction.action}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  +<Coins className="h-4 w-4" />{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Accessibility Modal */}
      <Dialog open={showAccessibility} onOpenChange={setShowAccessibility}>
        <DialogContent className="max-w-md" aria-describedby="accessibility-description">
          <DialogHeader>
            <DialogTitle>Accessibility Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6" id="accessibility-description">
            <div className="space-y-2">
              <Label>Font Size: {fontSize}pt</Label>
              <Slider
                min={14}
                max={20}
                step={1}
                value={[fontSize]}
                onValueChange={(v) => setFontSize(v[0])}
                aria-label="Adjust font size"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="contrast">High Contrast</Label>
              <Switch
                id="contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-label="Toggle high contrast mode"
              />
            </div>
            <div className="space-y-2">
              <Label>Haptic Intensity: {hapticIntensity === 0 ? "Off" : hapticIntensity === 1 ? "Low" : "High"}</Label>
              <Slider
                min={0}
                max={2}
                step={1}
                value={[hapticIntensity]}
                onValueChange={(v) => setHapticIntensity(v[0])}
                aria-label="Adjust haptic feedback intensity"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes coin-burst {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px) scale(0);
            opacity: 0;
          }
        }
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Shop;
