import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Clock, Star, ChevronRight } from "lucide-react";

const Home = () => {
  const [streak, setStreak] = useState(7);
  const [coins, setCoins] = useState(1250);

  const quests = [
    { id: 1, title: "Complete 3 Chemistry Experiments", reward: 150, progress: 67, type: "daily" },
    { id: 2, title: "Achieve 90% Accuracy in Physics Lab", reward: 200, progress: 45, type: "weekly" },
    { id: 3, title: "Collaborate in 2 Multiplayer Sessions", reward: 100, progress: 50, type: "daily" },
  ];

  const recentLabs = [
    { id: 1, name: "Ohm's Law Circuit", subject: "Physics", progress: 85, status: "in-progress" },
    { id: 2, name: "Chemical Reactions", subject: "Chemistry", progress: 100, status: "completed" },
    { id: 3, name: "Force Mechanics", subject: "Physics", progress: 30, status: "in-progress" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 px-4 space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2 vlx-fade-in">
          <h1 className="text-3xl font-bold">Welcome back, Scientist! 👋</h1>
          <p className="text-muted-foreground">Ready to continue your virtual experiments?</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 vlx-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <p className="text-2xl font-bold">{streak} days</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 vlx-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Coins</p>
                <p className="text-2xl font-bold">{coins}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 vlx-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold">4,850</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Daily Quests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Quests</h2>
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4">
            {quests.map((quest, index) => (
              <Card key={quest.id} className="p-4 vlx-slide-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{quest.title}</h3>
                        <Badge variant={quest.type === "daily" ? "default" : "secondary"} className="text-xs">
                          {quest.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        Reward: {quest.reward} coins
                      </p>
                    </div>
                    <Button size="sm" variant={quest.progress === 100 ? "default" : "outline"}>
                      {quest.progress === 100 ? "Claim" : "Continue"}
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{quest.progress}%</span>
                    </div>
                    <Progress value={quest.progress} className="h-2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Labs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Continue Learning</h2>
            <Button variant="ghost" size="sm">
              Browse Labs <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentLabs.map((lab, index) => (
              <Card key={lab.id} className="overflow-hidden vlx-slide-up" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-4xl">🧪</div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-medium">{lab.name}</h3>
                    <p className="text-sm text-muted-foreground">{lab.subject}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{lab.progress}%</span>
                    </div>
                    <Progress value={lab.progress} className="h-2" />
                  </div>
                  <Button className="w-full" variant={lab.status === "completed" ? "outline" : "default"}>
                    {lab.status === "completed" ? "Review" : "Continue"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-24 text-base">
            <Clock className="mr-2 h-5 w-5" />
            Practice Mode
          </Button>
          <Button variant="outline" className="h-24 text-base">
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
