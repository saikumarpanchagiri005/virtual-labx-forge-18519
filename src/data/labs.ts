export interface Lab {
  id: string;
  branchId: string;
  title: string;
  description: string;
  rating: number;
  timeEstimate: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites: string[];
  isBookmarked: boolean;
  isDownloaded: boolean;
  thumbnail?: string;
}

// Generate 75+ labs per branch with realistic data
const generateLabsForBranch = (branchId: string, count: number = 75): Lab[] => {
  const labTemplates = {
    ece: [
      { title: "Circuit Basics", desc: "Build a basic circuit with resistors and capacitors" },
      { title: "Ohm's Law Exploration", desc: "Investigate voltage, current, and resistance relationships" },
      { title: "Series & Parallel Circuits", desc: "Analyze different circuit configurations" },
      { title: "AC/DC Analysis", desc: "Study alternating and direct current behavior" },
      { title: "Transistor Fundamentals", desc: "Explore BJT and FET transistor operations" },
      { title: "Operational Amplifiers", desc: "Design circuits with op-amps" },
      { title: "Digital Logic Gates", desc: "Build AND, OR, NOT, and XOR gates" },
      { title: "Flip-Flops & Latches", desc: "Create memory elements for digital systems" },
      { title: "Oscillator Design", desc: "Generate periodic waveforms with RC/LC circuits" },
      { title: "Filter Networks", desc: "Design low-pass, high-pass, and band-pass filters" },
    ],
    mechanical: [
      { title: "Statics Fundamentals", desc: "Analyze forces in equilibrium structures" },
      { title: "Dynamics & Motion", desc: "Study objects in motion and acceleration" },
      { title: "Thermodynamics Cycles", desc: "Explore heat engines and refrigeration" },
      { title: "Fluid Mechanics", desc: "Analyze fluid flow and pressure systems" },
      { title: "Material Stress Testing", desc: "Investigate tensile and compressive strength" },
      { title: "Gear Train Design", desc: "Calculate gear ratios and torque transmission" },
      { title: "Beam Deflection", desc: "Measure bending in structural elements" },
      { title: "Heat Transfer", desc: "Study conduction, convection, and radiation" },
      { title: "Vibrations Analysis", desc: "Examine oscillatory motion in mechanical systems" },
      { title: "Machine Design", desc: "Design mechanical components for durability" },
    ],
    chemical: [
      { title: "Reaction Kinetics", desc: "Study reaction rates and mechanisms" },
      { title: "Chemical Equilibrium", desc: "Analyze reversible reaction dynamics" },
      { title: "Acid-Base Titration", desc: "Determine solution concentrations" },
      { title: "Distillation Process", desc: "Separate mixtures by boiling point" },
      { title: "Polymer Synthesis", desc: "Create long-chain molecules from monomers" },
      { title: "Catalysis Experiments", desc: "Explore catalyst effects on reaction rates" },
      { title: "Electrochemistry", desc: "Investigate redox reactions and batteries" },
      { title: "Chromatography", desc: "Separate chemical mixtures by affinity" },
      { title: "Reactor Design", desc: "Optimize chemical reactor configurations" },
      { title: "Process Control", desc: "Regulate temperature, pressure, and flow" },
    ],
    computer: [
      { title: "Sorting Algorithms", desc: "Implement bubble, merge, and quicksort" },
      { title: "Data Structures", desc: "Build stacks, queues, and linked lists" },
      { title: "Binary Search Trees", desc: "Create efficient search algorithms" },
      { title: "Graph Traversal", desc: "Explore BFS and DFS algorithms" },
      { title: "Dynamic Programming", desc: "Solve optimization problems efficiently" },
      { title: "Hash Tables", desc: "Implement fast key-value storage" },
      { title: "Recursion Mastery", desc: "Master recursive problem-solving" },
      { title: "Object-Oriented Design", desc: "Apply OOP principles to code" },
      { title: "Database Queries", desc: "Write SQL for data retrieval" },
      { title: "Machine Learning Intro", desc: "Train basic classification models" },
    ],
    civil: [
      { title: "Structural Analysis", desc: "Calculate forces in trusses and frames" },
      { title: "Concrete Mix Design", desc: "Optimize concrete strength and durability" },
      { title: "Soil Mechanics", desc: "Test soil properties for foundations" },
      { title: "Surveying Techniques", desc: "Measure land elevation and boundaries" },
      { title: "Highway Design", desc: "Plan roadway geometry and safety" },
      { title: "Hydrology & Drainage", desc: "Manage water flow in urban areas" },
      { title: "Bridge Engineering", desc: "Design load-bearing bridge structures" },
      { title: "Foundation Design", desc: "Calculate footing and pile requirements" },
      { title: "Environmental Impact", desc: "Assess construction effects on ecosystems" },
      { title: "Construction Planning", desc: "Schedule tasks and allocate resources" },
    ],
  };

  const baseTemplates = labTemplates[branchId as keyof typeof labTemplates] || labTemplates.computer;
  const labs: Lab[] = [];

  for (let i = 0; i < count; i++) {
    const template = baseTemplates[i % baseTemplates.length];
    const labNumber = i + 1;
    const difficultyTiers = ["beginner", "intermediate", "advanced"] as const;
    const difficulty = difficultyTiers[Math.floor(i / 25) % 3];
    
    labs.push({
      id: `${branchId}-${String(labNumber).padStart(3, "0")}`,
      branchId,
      title: `${template.title} ${labNumber > baseTemplates.length ? ` ${Math.floor(i / baseTemplates.length) + 1}` : ""}`,
      description: template.desc,
      rating: Math.max(3, Math.min(5, 3.5 + Math.random() * 1.5)),
      timeEstimate: `${10 + Math.floor(Math.random() * 50)} min`,
      difficulty,
      prerequisites: i > 0 && i % 5 === 0 ? [`${branchId}-${String(labNumber - 1).padStart(3, "0")}`] : [],
      isBookmarked: false,
      isDownloaded: false,
    });
  }

  return labs;
};

// Pre-generate labs for all branches
export const allLabs: Lab[] = [
  ...generateLabsForBranch("ece", 75),
  ...generateLabsForBranch("mechanical", 82),
  ...generateLabsForBranch("chemical", 68),
  ...generateLabsForBranch("civil", 71),
  ...generateLabsForBranch("computer", 95),
  ...generateLabsForBranch("aerospace", 58),
  ...generateLabsForBranch("biomedical", 64),
  ...generateLabsForBranch("environmental", 55),
  ...generateLabsForBranch("electrical", 78),
  ...generateLabsForBranch("materials", 48),
  ...generateLabsForBranch("industrial", 62),
  ...generateLabsForBranch("petroleum", 52),
  ...generateLabsForBranch("nuclear", 42),
  ...generateLabsForBranch("robotics", 85),
  ...generateLabsForBranch("software", 88),
];

export const getLabsByBranch = (branchId: string): Lab[] => {
  return allLabs.filter((lab) => lab.branchId === branchId);
};

export const getLabById = (labId: string): Lab | undefined => {
  return allLabs.find((lab) => lab.id === labId);
};
