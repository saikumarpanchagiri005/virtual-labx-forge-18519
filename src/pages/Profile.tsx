import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Star, Zap, Award, Settings } from "lucide-react";

const Profile = () => {
  const achievements = [
    { id: 1, name: "First Steps", description: "Complete your first experiment", unlocked: true },
    { id: 2, name: "Week Warrior", description: "Maintain a 7-day streak", unlocked: true },
    { id: 3, name: "Perfect Score", description: "Get 100% on any experiment", unlocked: false },
    { id: 4, name: "Team Player", description: "Complete 5 multiplayer sessions", unlocked: false },
  ];

  const stats = [
    { label: "Total XP", value: "4,850", icon: Star },
    { label: "Experiments", value: "24", icon: Zap },
    { label: "Achievements", value: "12/50", icon: Award },
    { label: "Rank", value: "#127", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 px-4 space-y-8">
        {/* Profile Header */}
        <Card className="p-6 vlx-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">JS</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-3xl font-bold">Junior Scientist</h1>
                <Badge variant="secondary">Level 12</Badge>
              </div>
              <p className="text-muted-foreground">Member since January 2025</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Level Progress</span>
                  <span className="text-muted-foreground">850/1000 XP</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="p-4 text-center vlx-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <Card 
                key={achievement.id} 
                className={`p-4 vlx-slide-up ${!achievement.unlocked && 'opacity-50'}`}
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${achievement.unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.unlocked && (
                      <Badge variant="secondary" className="mt-2">Unlocked</Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Card className="p-4 space-y-4">
            {[
              { action: "Completed", lab: "Ohm's Law Circuit", time: "2 hours ago" },
              { action: "Started", lab: "Chemical Reactions", time: "1 day ago" },
              { action: "Achieved", lab: "Week Warrior Badge", time: "3 days ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{activity.action} {activity.lab}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
