// Cookie Clicker upgrade tiers
// Each tier produces coins/second and has exponential cost scaling

export const CLICKER_UPGRADES = [
  {
    id: 'cursor',
    name: 'Curseur Magique',
    icon: '👆',
    baseCost: 15,
    baseProduction: 0.5,
    description: 'Clique automatiquement',
    flavorText: 'Le debut de l\'automatisation',
  },
  {
    id: 'hamster',
    name: 'Roue de Hamster',
    icon: '🐹',
    baseCost: 100,
    baseProduction: 2,
    description: 'Un hamster motive',
    flavorText: 'Il court, il court...',
  },
  {
    id: 'worker',
    name: 'Ouvrier',
    icon: '🔨',
    baseCost: 500,
    baseProduction: 8,
    description: 'Un travailleur assidu',
    flavorText: 'Le travail c\'est la sante',
  },
  {
    id: 'farm',
    name: 'Ferme a Pieces',
    icon: '🌾',
    baseCost: 2000,
    baseProduction: 25,
    description: 'Les pieces poussent comme des plantes',
    flavorText: 'L\'argent ne pousse pas... ou si ?',
  },
  {
    id: 'mine',
    name: 'Mine d\'Or',
    icon: '⛏️',
    baseCost: 7500,
    baseProduction: 80,
    description: 'Creuse profond pour trouver l\'or',
    flavorText: 'Plus profond, toujours plus profond',
  },
  {
    id: 'factory',
    name: 'Usine',
    icon: '🏭',
    baseCost: 25000,
    baseProduction: 250,
    description: 'Production industrielle',
    flavorText: 'Fordisme numismatique',
  },
  {
    id: 'bank',
    name: 'Banque',
    icon: '🏦',
    baseCost: 100000,
    baseProduction: 800,
    description: 'L\'argent genere de l\'argent',
    flavorText: 'Les interets composes, quelle merveille',
  },
  {
    id: 'laboratory',
    name: 'Laboratoire',
    icon: '🔬',
    baseCost: 400000,
    baseProduction: 2500,
    description: 'Synthese de monnaie',
    flavorText: 'De l\'alchimie moderne',
  },
  {
    id: 'portal',
    name: 'Portail Dimensionnel',
    icon: '🌀',
    baseCost: 1500000,
    baseProduction: 8000,
    description: 'Importe des pieces d\'autres dimensions',
    flavorText: 'L\'infini est riche',
  },
  {
    id: 'temple',
    name: 'Temple Sacre',
    icon: '🏛️',
    baseCost: 6000000,
    baseProduction: 25000,
    description: 'Les dieux sont genereux',
    flavorText: 'Priere exaucee',
  },
  {
    id: 'satellite',
    name: 'Station Spatiale',
    icon: '🛸',
    baseCost: 25000000,
    baseProduction: 80000,
    description: 'Minage d\'asteroides',
    flavorText: 'L\'espace, derniere frontiere',
  },
  {
    id: 'timemachine',
    name: 'Machine Temporelle',
    icon: '⏰',
    baseCost: 100000000,
    baseProduction: 250000,
    description: 'Vole des pieces dans le futur',
    flavorText: 'Le futur nous remerciera... ou pas',
  },
  {
    id: 'blackhole',
    name: 'Trou Noir',
    icon: '🕳️',
    baseCost: 500000000,
    baseProduction: 1000000,
    description: 'Absorbe la richesse de l\'univers',
    flavorText: 'Meme la lumiere n\'echappe pas a notre cupidite',
  },
]

// Cost formula: baseCost * 1.15^owned
export function getUpgradeCost(upgrade, owned) {
  return Math.floor(upgrade.baseCost * Math.pow(1.15, owned))
}

// Click power upgrades
export const CLICK_UPGRADES = [
  { id: 'click1', name: 'Doigts Agiles', cost: 100, multiplier: 2, icon: '✌️', desc: 'x2 par clic' },
  { id: 'click2', name: 'Mains de Fer', cost: 1000, multiplier: 3, icon: '🤜', desc: 'x3 par clic' },
  { id: 'click3', name: 'Poing de Titan', cost: 10000, multiplier: 5, icon: '👊', desc: 'x5 par clic' },
  { id: 'click4', name: 'Toucher de Midas', cost: 100000, multiplier: 10, icon: '🖐️', desc: 'x10 par clic' },
  { id: 'click5', name: 'Frappe Divine', cost: 1000000, multiplier: 25, icon: '⚡', desc: 'x25 par clic' },
  { id: 'click6', name: 'Big Bang', cost: 50000000, multiplier: 100, icon: '💥', desc: 'x100 par clic' },
]

// Prestige upgrades (bought with stardust after prestige reset)
export const PRESTIGE_UPGRADES = [
  { id: 'p_production', name: 'Aura de Richesse', icon: '💫', cost: 1, desc: '+10% production par niveau', maxLevel: 50, effect: 'production', bonus: 0.10 },
  { id: 'p_click', name: 'Toucher Stellaire', icon: '🌟', cost: 2, desc: '+25% puissance de clic', maxLevel: 20, effect: 'click', bonus: 0.25 },
  { id: 'p_golden', name: 'Chance Doree', icon: '🍀', cost: 3, desc: '+5% chance de golden click', maxLevel: 10, effect: 'goldenChance', bonus: 0.05 },
  { id: 'p_combo', name: 'Combo Infini', icon: '🔗', cost: 5, desc: '+1 combo max', maxLevel: 10, effect: 'comboMax', bonus: 1 },
  { id: 'p_start', name: 'Depart en Trombe', icon: '🚀', cost: 10, desc: 'Commence avec des curseurs gratuits', maxLevel: 5, effect: 'freeUpgrade', bonus: 5 },
  { id: 'p_crit', name: 'Coup Critique', icon: '💥', cost: 8, desc: '5% chance de clic x10', maxLevel: 10, effect: 'critChance', bonus: 0.05 },
  { id: 'p_offline', name: 'Gains Hors-ligne', icon: '😴', cost: 15, desc: '+10% production hors-ligne', maxLevel: 10, effect: 'offline', bonus: 0.10 },
]

// Stardust earned = floor(sqrt(totalCoinsEarned / 1000000))
export function calculateStardust(totalCoinsEarned) {
  return Math.floor(Math.sqrt(totalCoinsEarned / 1000000))
}

// Golden click config
export const GOLDEN_CLICK = {
  baseChance: 0.002, // per second
  duration: 15, // seconds
  multiplier: 7,
  minInterval: 60, // minimum seconds between golden clicks
}

// Combo config
export const COMBO_CONFIG = {
  baseMax: 5,
  timeout: 500, // ms between clicks to maintain combo
  bonusPerLevel: 0.1, // +10% per combo level
}
