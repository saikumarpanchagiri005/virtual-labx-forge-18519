import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Star, ArrowRight } from "lucide-react";

const Labs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const labs = [
    {
      id: 1,
      name: "Ohm's Law Circuit",
      subject: "Physics",
      difficulty: "Beginner",
      duration: "15 min",
      rating: 4.5,
      students: 1234,
      description: "Explore the relationship between voltage, current, and resistance",
    },
    {
      id: 2,
      name: "Chemical Reactions",
      subject: "Chemistry",
      difficulty: "Intermediate",
      duration: "25 min",
      rating: 4.8,
      students: 2156,
      description: "Observe and analyze various types of chemical reactions",
    },
    {
      id: 3,
      name: "Newton's Laws",
      subject: "Physics",
      difficulty: "Beginner",
      duration: "20 min",
      rating: 4.6,
      students: 1876,
      description: "Understand the fundamental laws of motion through interactive experiments",
    },
    {
      id: 4,
      name: "Acid-Base Titration",
      subject: "Chemistry",
      difficulty: "Advanced",
      duration: "30 min",
      rating: 4.7,
      students: 987,
      description: "Master precise measurement techniques in analytical chemistry",
    },
  ];

  const filteredLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Intermediate": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "Advanced": return "bg-red-500/10 text-red-700 dark:text-red-400";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 px-4 space-y-8">
        {/* Header */}
        <div className="space-y-4 vlx-fade-in">
          <h1 className="text-3xl font-bold">Virtual Labs</h1>
          <p className="text-muted-foreground">Explore our collection of interactive science experiments</p>
          
          {/* Branch Selector CTA */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Explore by Branch</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from 15+ engineering disciplines
                </p>
              </div>
              <Button onClick={() => navigate("/branch-selector")}>
                Browse Branches
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search labs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Subject Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", "Physics", "Chemistry", "Biology", "Engineering"].map((subject) => (
            <Button key={subject} variant="outline" size="sm">
              {subject}
            </Button>
          ))}
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLabs.map((lab, index) => (
            <Card key={lab.id} className="overflow-hidden vlx-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Lab Image/Preview */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-6xl">🧪</div>
              </div>

              {/* Lab Info */}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold">{lab.name}</h3>
                    <Badge variant="secondary">{lab.subject}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{lab.description}</p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lab.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    {lab.rating}
                  </div>
                  <div>{lab.students.toLocaleString()} students</div>
                </div>

                {/* Difficulty Badge */}
                <Badge className={getDifficultyColor(lab.difficulty)} variant="outline">
                  {lab.difficulty}
                </Badge>

                {/* Action Button */}
                <Button className="w-full">Start Experiment</Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredLabs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No labs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Labs;
