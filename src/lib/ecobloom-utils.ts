
import { v4 as uuidv4 } from 'uuid';

// Biome types for the ecosystem
export type Biome = 'tropical' | 'temperate';
export type Layer = 'surface' | 'underground' | 'sky';

// Function to generate unique IDs for ecosystem elements
export const generateId = () => uuidv4();

// Calculate CO2 capture for trees
export const calculateCO2Capture = (treeCount: number): number => {
  return treeCount * 22; // Average 22kg CO2 per tree
};

// Calculate level from experience
export const calculateLevel = (experience: number): number => {
  let level = 1;
  let expRequired = 100;
  
  while (experience >= expRequired) {
    level += 1;
    experience -= expRequired;
    expRequired = Math.floor(100 * Math.pow(1.5, level - 1));
  }
  
  return level;
};

// Calculate experience for next level
export const getExperienceForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Format currency values
export const formatCurrency = (value: number): string => {
  return `R$${value.toFixed(2)}`;
};

// Format large numbers with k/m suffix
export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}m`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toFixed(0);
};

// Generate random trees within bounds
export const generateRandomTrees = (count: number, biome: Biome, bounds: { width: number, height: number }) => {
  const trees = [];
  const roots = [];
  
  for (let i = 0; i < count; i++) {
    const id = generateId();
    const x = Math.random() * (bounds.width - 100) + 50;
    const y = bounds.height - 50;
    
    trees.push({
      id,
      type: 'tree',
      x,
      y,
      size: Math.random() * 5,
      age: Math.floor(Math.random() * 30),
      mature: false
    });
    
    roots.push({
      id: `root-${id}`,
      type: 'root',
      x,
      y,
      size: 0,
      age: 0
    });
  }
  
  return { trees, roots };
};
