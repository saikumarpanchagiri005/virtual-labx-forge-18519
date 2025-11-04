export interface Transaction {
  id: string;
  date: string;
  item: string;
  cost: number;
  type: "Purchase" | "Earning";
  category: string;
}

export const economyData = {
  balance: 1250,
  nextMilestone: 2000,
  transactions: [
    {
      id: "trans-001",
      date: "01/11/2025",
      item: "Voltmeter Skin",
      cost: -50,
      type: "Purchase" as const,
      category: "Cosmetics"
    },
    {
      id: "trans-002",
      date: "01/11/2025",
      item: "Lab Completion Reward",
      cost: 100,
      type: "Earning" as const,
      category: "Achievement"
    },
    {
      id: "trans-003",
      date: "31/10/2025",
      item: "Challenge Victory",
      cost: 150,
      type: "Earning" as const,
      category: "Challenge"
    },
    {
      id: "trans-004",
      date: "30/10/2025",
      item: "Circuit Analyzer Tool",
      cost: -75,
      type: "Purchase" as const,
      category: "Tools"
    },
    {
      id: "trans-005",
      date: "29/10/2025",
      item: "Daily Login Bonus",
      cost: 25,
      type: "Earning" as const,
      category: "Daily"
    },
    {
      id: "trans-006",
      date: "28/10/2025",
      item: "Guild Contribution",
      cost: 80,
      type: "Earning" as const,
      category: "Social"
    },
    {
      id: "trans-007",
      date: "27/10/2025",
      item: "Premium Lab Access",
      cost: -120,
      type: "Purchase" as const,
      category: "Access"
    },
    {
      id: "trans-008",
      date: "26/10/2025",
      item: "Leaderboard Ranking",
      cost: 200,
      type: "Earning" as const,
      category: "Competition"
    },
    {
      id: "trans-009",
      date: "25/10/2025",
      item: "Custom Avatar Parts",
      cost: -90,
      type: "Purchase" as const,
      category: "Cosmetics"
    },
    {
      id: "trans-010",
      date: "24/10/2025",
      item: "Experiment Perfect Score",
      cost: 175,
      type: "Earning" as const,
      category: "Achievement"
    }
  ]
};
