// Mock progress data for Lab Progress Tracker
export interface ProgressData {
  branchId: string;
  name: string;
  shortName: string;
  icon: string;
  labsCompleted: number;
  labsTotal: number;
  completionPercentage: number;
  milestones: string[];
  goals: Goal[];
  isFavorite: boolean;
  recentActivity: string;
}

export interface Goal {
  id: string;
  description: string;
  targetDate: string;
  targetLabs: number;
  currentProgress: number;
  isCompleted: boolean;
}

export const mockProgressData: ProgressData[] = [
  {
    branchId: "ece",
    name: "Electronics & Communication",
    shortName: "ECE",
    icon: "⚡",
    labsCompleted: 45,
    labsTotal: 75,
    completionPercentage: 60,
    milestones: ["Circuit Master", "Signal Pro"],
    goals: [],
    isFavorite: true,
    recentActivity: "2 days ago",
  },
  {
    branchId: "mechanical",
    name: "Mechanical Engineering",
    shortName: "MECH",
    icon: "⚙️",
    labsCompleted: 60,
    labsTotal: 82,
    completionPercentage: 73,
    milestones: ["Mechanics Expert", "Thermodynamics Ace"],
    goals: [],
    isFavorite: false,
    recentActivity: "1 week ago",
  },
  {
    branchId: "chemical",
    name: "Chemical Engineering",
    shortName: "CHEM",
    icon: "🧪",
    labsCompleted: 38,
    labsTotal: 68,
    completionPercentage: 56,
    milestones: ["Reaction Specialist"],
    goals: [],
    isFavorite: true,
    recentActivity: "3 days ago",
  },
  {
    branchId: "civil",
    name: "Civil Engineering",
    shortName: "CIVIL",
    icon: "🏗️",
    labsCompleted: 52,
    labsTotal: 71,
    completionPercentage: 73,
    milestones: ["Structure Designer", "Materials Pro"],
    goals: [],
    isFavorite: false,
    recentActivity: "5 days ago",
  },
  {
    branchId: "computer",
    name: "Computer Science",
    shortName: "CS",
    icon: "💻",
    labsCompleted: 70,
    labsTotal: 95,
    completionPercentage: 74,
    milestones: ["Algorithm Master", "Data Structures Pro", "AI Pioneer"],
    goals: [],
    isFavorite: true,
    recentActivity: "Today",
  },
  {
    branchId: "aerospace",
    name: "Aerospace Engineering",
    shortName: "AERO",
    icon: "✈️",
    labsCompleted: 20,
    labsTotal: 58,
    completionPercentage: 34,
    milestones: ["Flight Basics"],
    goals: [],
    isFavorite: false,
    recentActivity: "2 weeks ago",
  },
  {
    branchId: "biomedical",
    name: "Biomedical Engineering",
    shortName: "BME",
    icon: "🫀",
    labsCompleted: 15,
    labsTotal: 64,
    completionPercentage: 23,
    milestones: [],
    goals: [],
    isFavorite: false,
    recentActivity: "1 month ago",
  },
  {
    branchId: "environmental",
    name: "Environmental Engineering",
    shortName: "ENV",
    icon: "🌍",
    labsCompleted: 30,
    labsTotal: 55,
    completionPercentage: 55,
    milestones: ["Sustainability Champion"],
    goals: [],
    isFavorite: false,
    recentActivity: "1 week ago",
  },
  {
    branchId: "electrical",
    name: "Electrical Engineering",
    shortName: "EE",
    icon: "⚡",
    labsCompleted: 55,
    labsTotal: 78,
    completionPercentage: 71,
    milestones: ["Power Systems Expert", "Circuit Wizard"],
    goals: [],
    isFavorite: false,
    recentActivity: "4 days ago",
  },
  {
    branchId: "materials",
    name: "Materials Science",
    shortName: "MAT",
    icon: "🔬",
    labsCompleted: 12,
    labsTotal: 48,
    completionPercentage: 25,
    milestones: [],
    goals: [],
    isFavorite: false,
    recentActivity: "3 weeks ago",
  },
  {
    branchId: "industrial",
    name: "Industrial Engineering",
    shortName: "IE",
    icon: "📊",
    labsCompleted: 45,
    labsTotal: 62,
    completionPercentage: 73,
    milestones: ["Process Optimizer", "Systems Analyst"],
    goals: [],
    isFavorite: false,
    recentActivity: "6 days ago",
  },
  {
    branchId: "petroleum",
    name: "Petroleum Engineering",
    shortName: "PE",
    icon: "🛢️",
    labsCompleted: 18,
    labsTotal: 52,
    completionPercentage: 35,
    milestones: ["Extraction Basics"],
    goals: [],
    isFavorite: false,
    recentActivity: "2 weeks ago",
  },
  {
    branchId: "nuclear",
    name: "Nuclear Engineering",
    shortName: "NUC",
    icon: "☢️",
    labsCompleted: 8,
    labsTotal: 42,
    completionPercentage: 19,
    milestones: [],
    goals: [],
    isFavorite: false,
    recentActivity: "1 month ago",
  },
  {
    branchId: "robotics",
    name: "Robotics Engineering",
    shortName: "ROB",
    icon: "🤖",
    labsCompleted: 35,
    labsTotal: 85,
    completionPercentage: 41,
    milestones: ["Automation Starter", "AI Integration"],
    goals: [],
    isFavorite: true,
    recentActivity: "Today",
  },
  {
    branchId: "software",
    name: "Software Engineering",
    shortName: "SWE",
    icon: "📱",
    labsCompleted: 65,
    labsTotal: 88,
    completionPercentage: 74,
    milestones: ["Full Stack Pro", "Cloud Expert"],
    goals: [],
    isFavorite: false,
    recentActivity: "Yesterday",
  },
];

// Calculate overall mastery percentage
export const calculateOverallMastery = (progressData: ProgressData[]): number => {
  const totalCompleted = progressData.reduce((sum, branch) => sum + branch.labsCompleted, 0);
  const totalLabs = progressData.reduce((sum, branch) => sum + branch.labsTotal, 0);
  return Math.round((totalCompleted / totalLabs) * 100);
};
