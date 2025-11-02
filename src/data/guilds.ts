export interface Guild {
  id: string;
  name: string;
  members: number;
  focus: string;
  activeLabs: number;
  isJoined: boolean;
  isFeatured?: boolean;
  isHot?: boolean;
  description?: string;
}

export const mockGuildData: Guild[] = [
  { 
    id: "guild-001", 
    name: "ECE Experts", 
    members: 15, 
    focus: "ECE", 
    activeLabs: 8, 
    isJoined: true,
    isFeatured: true,
    description: "Master electrical circuits and digital systems together"
  },
  { 
    id: "guild-002", 
    name: "Circuit Masters", 
    members: 12, 
    focus: "ECE", 
    activeLabs: 6, 
    isJoined: false,
    isHot: true,
    description: "Advanced circuit analysis and design collaboration"
  },
  { 
    id: "guild-003", 
    name: "Mechanical Minds", 
    members: 18, 
    focus: "Mechanical", 
    activeLabs: 10, 
    isJoined: false,
    isHot: true,
    description: "Explore mechanics, thermodynamics, and fluid dynamics"
  },
  { 
    id: "guild-004", 
    name: "Chemical Creators", 
    members: 10, 
    focus: "Chemical", 
    activeLabs: 5, 
    isJoined: false,
    description: "Discover reactions and molecular structures together"
  },
  { 
    id: "guild-005", 
    name: "Voltage Victors", 
    members: 14, 
    focus: "ECE", 
    activeLabs: 7, 
    isJoined: false,
    description: "Power electronics and voltage regulation specialists"
  },
  { 
    id: "guild-006", 
    name: "General Lab Alliance", 
    members: 20, 
    focus: "General", 
    activeLabs: 12, 
    isJoined: false,
    isHot: true,
    description: "Multi-discipline collaboration across all engineering fields"
  },
  { 
    id: "guild-007", 
    name: "Signal Processors", 
    members: 8, 
    focus: "ECE", 
    activeLabs: 4, 
    isJoined: false,
    description: "DSP and communication systems enthusiasts"
  },
  { 
    id: "guild-008", 
    name: "Thermal Engineers", 
    members: 11, 
    focus: "Mechanical", 
    activeLabs: 6, 
    isJoined: false,
    description: "Heat transfer and energy systems collaboration"
  },
  { 
    id: "guild-009", 
    name: "Quantum Questers", 
    members: 6, 
    focus: "General", 
    activeLabs: 3, 
    isJoined: false,
    description: "Exploring advanced physics and quantum mechanics"
  },
  { 
    id: "guild-010", 
    name: "Lab Pioneers", 
    members: 16, 
    focus: "General", 
    activeLabs: 9, 
    isJoined: false,
    isFeatured: false,
    description: "Beginner-friendly guild for all engineering students"
  },
];

export const filterOptions = ["All", "Open", "ECE-Focused", "Mechanics-Focused", "Chemical-Focused", "General"];
export const sortOptions = ["Member Count", "Activity", "Name"];
export const focusOptions = ["ECE", "Mechanical", "Chemical", "General"];
