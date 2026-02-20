// ============================================
// FOOD ITEMS - Different foods affect different stats
// ============================================
export const FOOD_ITEMS = {
  // Basic foods
  croquettes: {
    id: 'croquettes', name: 'Croquettes', icon: '🍖', price: 5,
    desc: 'Nourriture basique', category: 'basic',
    effects: { hunger: 15 }, statBonus: {},
  },
  salade: {
    id: 'salade', name: 'Salade Fraiche', icon: '🥗', price: 8,
    desc: 'Legere et saine', category: 'basic',
    effects: { hunger: 10, health: 5 }, statBonus: { vit: 1 },
  },
  viande: {
    id: 'viande', name: 'Steak Juteux', icon: '🥩', price: 15,
    desc: 'Riche en proteines', category: 'basic',
    effects: { hunger: 25 }, statBonus: { atk: 1 },
  },
  poisson: {
    id: 'poisson', name: 'Poisson Grille', icon: '🐟', price: 12,
    desc: 'Bon pour le cerveau', category: 'basic',
    effects: { hunger: 20 }, statBonus: { int: 1 },
  },
  fruits: {
    id: 'fruits', name: 'Panier de Fruits', icon: '🍎', price: 10,
    desc: 'Vitamines et energie', category: 'basic',
    effects: { hunger: 12, energy: 10 }, statBonus: { spd: 1 },
  },

  // Premium foods
  gateau: {
    id: 'gateau', name: 'Gateau Royal', icon: '🎂', price: 50,
    desc: 'Delicieux et rare', category: 'premium',
    effects: { hunger: 30, happiness: 20 }, statBonus: { cha: 3 },
  },
  sushi: {
    id: 'sushi', name: 'Plateau Sushi', icon: '🍣', price: 40,
    desc: 'Equilibre parfait', category: 'premium',
    effects: { hunger: 25, health: 10 }, statBonus: { int: 2, spd: 1 },
  },
  ramen: {
    id: 'ramen', name: 'Ramen Special', icon: '🍜', price: 35,
    desc: 'Chaud et reconfortant', category: 'premium',
    effects: { hunger: 30, happiness: 10, energy: 5 }, statBonus: { vit: 2 },
  },
  pizza: {
    id: 'pizza', name: 'Pizza Geante', icon: '🍕', price: 30,
    desc: 'La preferee de tous !', category: 'premium',
    effects: { hunger: 35, happiness: 15 }, statBonus: { atk: 1, def: 1 },
  },

  // Elemental foods
  piment: {
    id: 'piment', name: 'Piment Infernal', icon: '🌶️', price: 80,
    desc: 'Augmente l\'affinite Feu', category: 'elemental',
    effects: { hunger: 15, energy: 10 }, statBonus: { atk: 3 }, elementBonus: 'fire',
  },
  glace: {
    id: 'glace', name: 'Glace Eternelle', icon: '🧊', price: 80,
    desc: 'Augmente l\'affinite Eau', category: 'elemental',
    effects: { hunger: 15, happiness: 10 }, statBonus: { def: 3 }, elementBonus: 'water',
  },
  champignon: {
    id: 'champignon', name: 'Champignon Ancien', icon: '🍄', price: 80,
    desc: 'Augmente l\'affinite Terre', category: 'elemental',
    effects: { hunger: 15, health: 10 }, statBonus: { vit: 3 }, elementBonus: 'earth',
  },
  menthe: {
    id: 'menthe', name: 'Menthe Celeste', icon: '🌿', price: 80,
    desc: 'Augmente l\'affinite Air', category: 'elemental',
    effects: { hunger: 15, energy: 15 }, statBonus: { spd: 3 }, elementBonus: 'wind',
  },
  miel_dore: {
    id: 'miel_dore', name: 'Miel Dore', icon: '🍯', price: 80,
    desc: 'Augmente l\'affinite Lumiere', category: 'elemental',
    effects: { hunger: 15, happiness: 15 }, statBonus: { int: 3 }, elementBonus: 'light',
  },
  truffe_noire: {
    id: 'truffe_noire', name: 'Truffe Obscure', icon: '🖤', price: 80,
    desc: 'Augmente l\'affinite Ombre', category: 'elemental',
    effects: { hunger: 15 }, statBonus: { cha: 3 }, elementBonus: 'shadow',
  },

  // Legendary foods
  elixir: {
    id: 'elixir', name: 'Elixir de Vie', icon: '🧪', price: 500,
    desc: 'Restaure tout', category: 'legendary',
    effects: { hunger: 100, happiness: 50, health: 50, energy: 50, hygiene: 30 },
    statBonus: { vit: 5, atk: 5, def: 5, spd: 5, int: 5, cha: 5 },
  },
  ambroisie: {
    id: 'ambroisie', name: 'Ambroisie', icon: '🌟', price: 1000,
    desc: 'Nourriture des dieux - boost massif d\'EXP', category: 'legendary',
    effects: { hunger: 50, happiness: 30 }, statBonus: {},
    special: 'expBoost', expMultiplier: 3, duration: 300, // 5 min
  },
}

// ============================================
// EQUIPMENT
// ============================================
export const EQUIPMENT = {
  // Weapons (boost ATK)
  griffe_bois: {
    id: 'griffe_bois', name: 'Griffes en Bois', icon: '🪵', price: 100,
    slot: 'weapon', desc: 'Basique mais efficace',
    stats: { atk: 10 }, minStage: 'junior',
  },
  griffe_fer: {
    id: 'griffe_fer', name: 'Griffes de Fer', icon: '⚔️', price: 500,
    slot: 'weapon', desc: 'Solides et tranchantes',
    stats: { atk: 25, spd: 5 }, minStage: 'teen',
  },
  crocs_cristal: {
    id: 'crocs_cristal', name: 'Crocs de Cristal', icon: '💎', price: 2000,
    slot: 'weapon', desc: 'Brillent d\'une lueur magique',
    stats: { atk: 50, int: 15 }, minStage: 'adult',
  },
  lame_ombre: {
    id: 'lame_ombre', name: 'Lame de l\'Ombre', icon: '🗡️', price: 8000,
    slot: 'weapon', desc: 'Forgee dans les tenebres',
    stats: { atk: 80, spd: 20, cha: 10 }, minStage: 'champion',
  },
  excalibur: {
    id: 'excalibur', name: 'Excalibur', icon: '✨', price: 50000,
    slot: 'weapon', desc: 'L\'arme legendaire',
    stats: { atk: 150, int: 50, cha: 30 }, minStage: 'legendary',
  },

  // Armor (boost DEF)
  plastron_cuir: {
    id: 'plastron_cuir', name: 'Plastron de Cuir', icon: '🧥', price: 80,
    slot: 'armor', desc: 'Protection legere',
    stats: { def: 10 }, minStage: 'junior',
  },
  armure_ecaille: {
    id: 'armure_ecaille', name: 'Armure d\'Ecailles', icon: '🛡️', price: 400,
    slot: 'armor', desc: 'Resistant aux coups',
    stats: { def: 25, vit: 10 }, minStage: 'teen',
  },
  cape_mithril: {
    id: 'cape_mithril', name: 'Cape de Mithril', icon: '🧣', price: 1800,
    slot: 'armor', desc: 'Legere comme une plume',
    stats: { def: 40, spd: 20 }, minStage: 'adult',
  },
  armure_dragon: {
    id: 'armure_dragon', name: 'Armure de Dragon', icon: '🐉', price: 7000,
    slot: 'armor', desc: 'Ecailles de dragon ancien',
    stats: { def: 80, vit: 30, atk: 10 }, minStage: 'champion',
  },

  // Accessories (various bonuses)
  bandana: {
    id: 'bandana', name: 'Bandana Cool', icon: '🎀', price: 50,
    slot: 'accessory', desc: 'Style +100',
    stats: { cha: 10, spd: 5 }, minStage: 'baby',
  },
  lunettes: {
    id: 'lunettes', name: 'Lunettes de Sage', icon: '🤓', price: 200,
    slot: 'accessory', desc: 'Vision claire',
    stats: { int: 20, cha: 5 }, minStage: 'junior',
  },
  amulette: {
    id: 'amulette', name: 'Amulette Mystique', icon: '📿', price: 1500,
    slot: 'accessory', desc: 'Aura protectrice',
    stats: { int: 15, def: 15, vit: 15 }, minStage: 'teen',
  },
  couronne: {
    id: 'couronne', name: 'Couronne Royale', icon: '👑', price: 10000,
    slot: 'accessory', desc: 'Digne d\'un roi',
    stats: { cha: 50, int: 20, atk: 10 }, minStage: 'adult',
  },
  collier_etoile: {
    id: 'collier_etoile', name: 'Collier d\'Etoiles', icon: '⭐', price: 30000,
    slot: 'accessory', desc: 'Pouvoir cosmique',
    stats: { vit: 30, atk: 30, def: 30, spd: 30, int: 30, cha: 30 }, minStage: 'champion',
  },
}

// ============================================
// CARE ITEMS
// ============================================
export const CARE_ITEMS = {
  savon: {
    id: 'savon', name: 'Savon', icon: '🧼', price: 5,
    desc: 'Nettoyage basique', effects: { hygiene: 30 },
  },
  shampooing: {
    id: 'shampooing', name: 'Shampooing Luxe', icon: '🧴', price: 20,
    desc: 'Nettoyage complet', effects: { hygiene: 60, happiness: 5 },
  },
  bandage: {
    id: 'bandage', name: 'Bandage', icon: '🩹', price: 15,
    desc: 'Soins legers', effects: { health: 20 },
  },
  medicament: {
    id: 'medicament', name: 'Medicament', icon: '💊', price: 50,
    desc: 'Guerison rapide', effects: { health: 50 },
  },
  potion_energie: {
    id: 'potion_energie', name: 'Potion d\'Energie', icon: '⚡', price: 30,
    desc: 'Regain d\'energie', effects: { energy: 40 },
  },
  jouet: {
    id: 'jouet', name: 'Jouet', icon: '🧸', price: 15,
    desc: 'Pour jouer', effects: { happiness: 25 },
  },
  balle: {
    id: 'balle', name: 'Super Balle', icon: '⚽', price: 40,
    desc: 'Le jouet prefere !', effects: { happiness: 40, energy: -10 },
  },
}

// Stage index for comparison
export const STAGE_ORDER = ['egg', 'baby', 'junior', 'teen', 'adult', 'champion', 'legendary']

export function isStageUnlocked(currentStage, requiredStage) {
  return STAGE_ORDER.indexOf(currentStage) >= STAGE_ORDER.indexOf(requiredStage)
}
