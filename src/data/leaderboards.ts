export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  branch: string;
  labsCompleted: number;
  lastActive: string;
  isTopMover?: boolean;
  rankChange?: number;
}

export const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: "CircuitMaster", score: 950, branch: "ECE", labsCompleted: 48, lastActive: "02/11/2025", isTopMover: false },
  { rank: 2, username: "VoltageKing", score: 920, branch: "ECE", labsCompleted: 45, lastActive: "01/11/2025", isTopMover: false },
  { rank: 3, username: "OhmsLaw_Pro", score: 890, branch: "Mechanical", labsCompleted: 42, lastActive: "02/11/2025", isTopMover: false },
  { rank: 4, username: "ResistorQueen", score: 860, branch: "ECE", labsCompleted: 40, lastActive: "01/11/2025", isTopMover: true, rankChange: 7 },
  { rank: 5, username: "CurrentFlow", score: 830, branch: "Chemical", labsCompleted: 38, lastActive: "31/10/2025", isTopMover: false },
  { rank: 6, username: "CapacitorAce", score: 800, branch: "ECE", labsCompleted: 36, lastActive: "02/11/2025", isTopMover: false },
  { rank: 7, username: "InductorPro", score: 780, branch: "Mechanical", labsCompleted: 35, lastActive: "01/11/2025", isTopMover: true, rankChange: 5 },
  { rank: 8, username: "TransistorTech", score: 750, branch: "ECE", labsCompleted: 33, lastActive: "31/10/2025", isTopMover: false },
  { rank: 9, username: "DiodeExpert", score: 720, branch: "Chemical", labsCompleted: 31, lastActive: "02/11/2025", isTopMover: false },
  { rank: 10, username: "LEDLuminary", score: 690, branch: "ECE", labsCompleted: 29, lastActive: "01/11/2025", isTopMover: false },
  { rank: 11, username: "AmplifierGuru", score: 660, branch: "Mechanical", labsCompleted: 27, lastActive: "31/10/2025", isTopMover: false },
  { rank: 12, username: "SignalSage", score: 630, branch: "ECE", labsCompleted: 25, lastActive: "30/10/2025", isTopMover: false },
  { rank: 13, username: "FrequencyFan", score: 600, branch: "Chemical", labsCompleted: 23, lastActive: "02/11/2025", isTopMover: false },
  { rank: 14, username: "WaveformWiz", score: 570, branch: "ECE", labsCompleted: 21, lastActive: "01/11/2025", isTopMover: false },
  { rank: 15, username: "PowerSupply", score: 540, branch: "Mechanical", labsCompleted: 19, lastActive: "31/10/2025", isTopMover: false },
  { rank: 16, username: "GroundGuru", score: 510, branch: "ECE", labsCompleted: 17, lastActive: "30/10/2025", isTopMover: false },
  { rank: 17, username: "VoltMeter", score: 480, branch: "Chemical", labsCompleted: 15, lastActive: "29/10/2025", isTopMover: false },
  { rank: 18, username: "OscilloScoper", score: 465, branch: "ECE", labsCompleted: 14, lastActive: "02/11/2025", isTopMover: false },
  { rank: 19, username: "LabRunner", score: 455, branch: "Mechanical", labsCompleted: 13, lastActive: "01/11/2025", isTopMover: false },
  { rank: 20, username: "TestBench", score: 445, branch: "ECE", labsCompleted: 12, lastActive: "31/10/2025", isTopMover: false },
];

export const currentUser = {
  rank: 42,
  username: "You",
  score: 450,
  branch: "ECE",
  labsCompleted: 11,
  lastActive: "02/11/2025"
};

export const filterOptions = ["Global", "ECE", "Mechanical", "Chemical", "Challenge"];
export const sortOptions = ["Score", "Labs Completed", "Recent Activity"];
