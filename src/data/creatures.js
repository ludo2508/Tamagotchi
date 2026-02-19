// Evolution stages and creature data
// Ages in real-time hours
export const STAGES = {
  egg: { name: 'Oeuf', minAge: 0, icon: '🥚' },
  baby: { name: 'Bebe', minAge: 0, icon: '👶', pixelSize: 3 },
  junior: { name: 'Junior', minAge: 2, icon: '🧒', pixelSize: 4 },       // 2h
  teen: { name: 'Adolescent', minAge: 24, icon: '🌟', pixelSize: 5 },    // 1 day
  adult: { name: 'Adulte', minAge: 168, icon: '💪', pixelSize: 5 },      // 1 week
  champion: { name: 'Champion', minAge: 720, icon: '🏆', pixelSize: 6 }, // 1 month
  legendary: { name: 'Legendaire', minAge: 2160, icon: '👑', pixelSize: 7 }, // 3 months
}

export const ELEMENTS = {
  fire:   { name: 'Feu',     icon: '🔥', color: '#f97316', statAffinity: 'atk', strong: ['earth', 'wind'], weak: ['water', 'shadow'] },
  water:  { name: 'Eau',     icon: '💧', color: '#3b82f6', statAffinity: 'def', strong: ['fire', 'light'], weak: ['earth', 'wind'] },
  earth:  { name: 'Terre',   icon: '🌿', color: '#84cc16', statAffinity: 'vit', strong: ['water', 'shadow'], weak: ['fire', 'wind'] },
  wind:   { name: 'Air',     icon: '💨', color: '#22d3ee', statAffinity: 'spd', strong: ['earth', 'water'], weak: ['fire', 'light'] },
  light:  { name: 'Lumiere', icon: '✨', color: '#eab308', statAffinity: 'int', strong: ['shadow', 'wind'], weak: ['water', 'earth'] },
  shadow: { name: 'Ombre',   icon: '🌑', color: '#8b5cf6', statAffinity: 'cha', strong: ['light', 'fire'], weak: ['earth', 'water'] },
}

// Stat growth rates per training action
export const STAT_GROWTH = {
  baby:      { base: 1, multiplier: 0.5 },
  junior:    { base: 2, multiplier: 1.0 },
  teen:      { base: 3, multiplier: 1.5 },
  adult:     { base: 4, multiplier: 2.0 },
  champion:  { base: 5, multiplier: 2.5 },
  legendary: { base: 6, multiplier: 3.0 },
}

// Needs decay rates per real minute
export const DECAY_RATES = {
  hunger:    { rate: 1.2, stages: { baby: 0.8, junior: 1.0, teen: 1.2, adult: 1.5, champion: 1.8, legendary: 2.0 } },
  happiness: { rate: 0.8, stages: { baby: 0.6, junior: 0.7, teen: 0.8, adult: 1.0, champion: 1.2, legendary: 1.4 } },
  hygiene:   { rate: 0.6, stages: { baby: 0.5, junior: 0.6, teen: 0.7, adult: 0.8, champion: 0.9, legendary: 1.0 } },
  energy:    { rate: 0.3, stages: { baby: 0.2, junior: 0.3, teen: 0.3, adult: 0.4, champion: 0.5, legendary: 0.5 } },
}

// Creature traits - randomly assigned, affect gameplay
export const TRAITS = {
  gourmand:   { name: 'Gourmand',   desc: 'Mange plus mais gagne plus de VIT', icon: '🍔', effect: { hungerDecay: 1.3, vitGrowth: 1.5 } },
  athlete:    { name: 'Athlete',    desc: 'Plus endurant, meilleur ATK', icon: '🏅', effect: { energyDecay: 0.7, atkGrowth: 1.3 } },
  curieux:    { name: 'Curieux',    desc: 'Apprend plus vite', icon: '🔍', effect: { intGrowth: 1.5, expBonus: 1.2 } },
  timide:     { name: 'Timide',     desc: 'Meilleure defense, moins social', icon: '😶', effect: { defGrowth: 1.4, chaGrowth: 0.7 } },
  joueur:     { name: 'Joueur',     desc: 'Plus heureux quand il joue', icon: '🎮', effect: { happinessFromPlay: 1.5, spdGrowth: 1.2 } },
  nocturne:   { name: 'Nocturne',   desc: 'Plus actif la nuit', icon: '🌙', effect: { nightBonus: 1.5, shadowAffinity: 1.3 } },
  solaire:    { name: 'Solaire',    desc: 'Plus actif le jour', icon: '☀️', effect: { dayBonus: 1.5, lightAffinity: 1.3 } },
  robuste:    { name: 'Robuste',    desc: 'Tombe rarement malade', icon: '💎', effect: { healthDecay: 0.5, defGrowth: 1.2 } },
  chanceux:   { name: 'Chanceux',   desc: 'Trouve plus d\'objets', icon: '🍀', effect: { lootBonus: 1.5, coinBonus: 1.1 } },
  feroce:     { name: 'Feroce',     desc: 'Plus fort en combat', icon: '⚡', effect: { atkGrowth: 1.4, critBonus: 1.3 } },
}

// Pixel art data for the Evoli creature
export const EVOLI_COLORS = {
  t: 'transparent',
  c1: '#493269', c2: '#916ac6', c3: '#a673c6', c4: '#827dd1',
  c5: '#4a3369', c6: '#9878cc', c7: '#79b2d0', c8: '#da8aba',
  c9: '#4e366d', c10: '#97e3ba', c11: '#835cbc', c12: '#f0b1aa',
  c13: '#f5f4f6', c14: '#a893d0', c15: '#eecd94', c16: '#b07fc9',
  c17: '#8d65b0', c18: '#4a336a', c19: '#be7cb9', c20: '#faf9fa',
  c21: '#7461bb', c22: '#523c70', c23: '#cc96c8', c24: '#84d7cb',
  c25: '#704f9d', c26: '#eceaf0', c27: '#fbfbfc', c28: '#fefefe',
}

export const EVOLI_PIXELS = [
  ['t','c1','c1','c1','t','t','t','t','t','t','t','t','t','t','t','t','t','t','t','t','t','c1','c1','c1','t','t','t','t'],
  ['c1','c2','c2','c3','c1','t','t','t','t','t','t','t','t','t','t','t','t','t','t','t','c1','c4','c4','c5','t','t','t','t'],
  ['c1','c2','c6','c2','c3','c1','t','t','t','t','t','t','t','t','t','t','t','t','t','c5','c4','c6','c7','c6','c1','t','t','t'],
  ['c1','c2','c8','c6','c6','c3','c1','t','t','t','t','t','t','t','t','t','t','t','c1','c4','c6','c7','c7','c6','c1','t','t','t'],
  ['c1','c2','c8','c8','c2','c3','c3','c9','t','t','t','t','t','t','t','t','t','c1','c4','c4','c7','c10','c7','c6','c1','t','t','t'],
  ['c1','c11','c8','c8','c8','c6','c3','c9','t','t','t','t','t','t','t','t','c1','c2','c4','c7','c10','c10','c7','c6','c1','t','t','t'],
  ['c5','c2','c8','c12','c8','c6','c2','c2','c1','c13','c1','c1','c1','c1','c1','t','c1','c4','c14','c10','c10','c15','c16','c2','c1','t','t','t'],
  ['t','c5','c11','c12','c12','c6','c4','c2','c3','c16','c3','c16','c16','c16','c16','c16','c6','c4','c14','c15','c15','c12','c14','c11','c1','t','t','t'],
  ['t','c1','c2','c19','c12','c8','c3','c3','c16','c16','c16','c3','c16','c16','c16','c16','c16','c16','c14','c12','c12','c19','c11','c1','t','t','t','t'],
  ['t','c20','c5','c11','c19','c19','c3','c3','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c14','c12','c12','c19','c11','c1','t','t','t','t'],
  ['t','t','c5','c1','c3','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c11','c1','t','t','t','t','t','t'],
  ['t','t','c1','c11','c3','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c2','c18','t','t','t','t','t','t'],
  ['t','t','c1','c3','c16','c1','c18','c15','c1','c16','c16','c16','c16','c16','c1','c12','c1','c1','c16','c16','c6','c5','t','t','t','t','t','t'],
  ['t','c1','c11','c2','c16','c1','c1','c18','c1','c16','c16','c16','c16','c16','c1','c1','c1','c1','c16','c16','c6','c21','c22','t','t','t','t','t'],
  ['c1','c2','c2','c16','c23','c1','c1','c1','c1','c23','c23','c23','c23','c23','c9','c1','c1','c1','c14','c14','c6','c3','c2','c1','t','t','t','t'],
  ['c1','c11','c11','c14','c23','c23','c1','c1','c23','c23','c1','c23','c1','c23','c19','c1','c1','c1','c14','c14','c6','c4','c2','c1','t','t','t','t'],
  ['t','c1','c2','c2','c23','c23','c23','c23','c23','c23','c23','c1','c23','c23','c23','c23','c23','c23','c14','c6','c6','c11','c1','t','t','t','t','t'],
  ['t','t','c1','c5','c2','c23','c23','c23','c23','c23','c23','c23','c23','c23','c23','c23','c23','c16','c6','c6','c5','c5','t','t','c1','c1','c1','t'],
  ['t','t','t','t','c5','c6','c3','c16','c23','c23','c23','c23','c23','c23','c16','c16','c16','c17','c5','c5','c5','t','t','c1','c7','c24','c24','c1'],
  ['t','t','t','t','t','c1','c1','c3','c3','c3','c16','c3','c3','c16','c3','c16','c2','c25','c22','t','t','t','c1','c24','c24','c24','c5','c1'],
  ['t','t','t','t','c1','c11','c3','c16','c12','c12','c12','c12','c12','c23','c23','c14','c14','c3','c2','c9','t','c1','c7','c10','c10','c7','c1','t'],
  ['t','t','t','t','c1','c3','c16','c12','c12','c15','c15','c15','c15','c12','c16','c14','c16','c3','c6','c21','c1','c1','c7','c7','c10','c10','c7','c1'],
  ['t','t','t','t','c1','c2','c3','c12','c15','c15','c15','c15','c15','c15','c16','c6','c3','c3','c6','c6','c11','c1','c4','c7','c7','c10','c7','c1'],
  ['t','t','t','c1','c11','c2','c6','c6','c15','c15','c15','c15','c12','c16','c6','c3','c2','c11','c6','c6','c6','c1','c4','c21','c7','c7','c7','c1'],
  ['t','t','t','c18','c11','c1','c6','c6','c3','c15','c15','c19','c2','c6','c3','c17','c5','c4','c6','c6','c6','c1','c2','c4','c21','c4','c21','c1'],
  ['t','t','t','c1','c11','c18','c6','c6','c6','c1','c12','c19','c2','c3','c6','c17','c1','c4','c6','c6','c6','c1','c2','c2','c4','c21','c1','t'],
  ['t','t','t','c1','c11','c1','c4','c4','c3','c1','c25','c17','c2','c2','c2','c25','c1','c4','c4','c6','c2','c1','c2','c2','c21','c18','t','t'],
  ['t','t','t','t','c1','c1','c2','c2','c6','c1','c5','c2','c3','c2','c25','c1','c11','c11','c4','c2','c1','c21','c21','c21','c1','t','t','t'],
  ['t','t','t','t','t','c18','c5','c5','c1','c1','c26','c1','c1','c1','c1','c1','c1','c1','c1','c1','c1','c18','c1','c18','t','t','t','t'],
]

// Evolution visual modifiers per element
export const ELEMENT_TINTS = {
  fire:   { overlay: 'rgba(249, 115, 22, 0.15)', glow: '#f97316' },
  water:  { overlay: 'rgba(59, 130, 246, 0.15)', glow: '#3b82f6' },
  earth:  { overlay: 'rgba(132, 204, 22, 0.15)', glow: '#84cc16' },
  wind:   { overlay: 'rgba(34, 211, 238, 0.15)', glow: '#22d3ee' },
  light:  { overlay: 'rgba(234, 179, 8, 0.15)', glow: '#eab308' },
  shadow: { overlay: 'rgba(139, 92, 246, 0.15)', glow: '#8b5cf6' },
}

// Level thresholds
export const LEVEL_EXP = (level) => Math.floor(100 * Math.pow(1.15, level - 1))

// Max stats per stage
export const MAX_STATS = {
  baby: 50,
  junior: 150,
  teen: 350,
  adult: 600,
  champion: 850,
  legendary: 999,
}
