// Battle moves - creatures learn moves based on level, type, and stats

export const MOVES = {
  // ===== FIRE MOVES =====
  flammeche: {
    id: 'flammeche', name: 'Flammeche', element: 'fire', icon: '🔥',
    power: 30, accuracy: 95, pp: 20,
    type: 'attack', stat: 'atk',
    desc: 'Une petite flamme rapide',
  },
  lance_flammes: {
    id: 'lance_flammes', name: 'Lance-Flammes', element: 'fire', icon: '🔥',
    power: 65, accuracy: 85, pp: 10,
    type: 'attack', stat: 'atk',
    desc: 'Un puissant jet de feu',
    minLevel: 10,
  },
  eruption: {
    id: 'eruption', name: 'Eruption', element: 'fire', icon: '🌋',
    power: 100, accuracy: 70, pp: 5,
    type: 'attack', stat: 'atk',
    desc: 'Explosion volcanique devastatrice',
    minLevel: 25,
  },

  // ===== WATER MOVES =====
  jet_eau: {
    id: 'jet_eau', name: 'Jet d\'Eau', element: 'water', icon: '💧',
    power: 30, accuracy: 95, pp: 20,
    type: 'attack', stat: 'atk',
    desc: 'Un jet d\'eau precis',
  },
  vague: {
    id: 'vague', name: 'Vague Deferlante', element: 'water', icon: '🌊',
    power: 60, accuracy: 85, pp: 10,
    type: 'attack', stat: 'int',
    desc: 'Une vague puissante',
    minLevel: 10,
  },
  tsunami: {
    id: 'tsunami', name: 'Tsunami', element: 'water', icon: '🌊',
    power: 95, accuracy: 75, pp: 5,
    type: 'attack', stat: 'int',
    desc: 'Un mur d\'eau gigantesque',
    minLevel: 25,
  },

  // ===== EARTH MOVES =====
  racine: {
    id: 'racine', name: 'Racine', element: 'earth', icon: '🌿',
    power: 25, accuracy: 100, pp: 20,
    type: 'attack', stat: 'atk',
    desc: 'Des racines jaillissent du sol',
    special: 'drain', drainPercent: 0.3,
  },
  seisme: {
    id: 'seisme', name: 'Seisme', element: 'earth', icon: '🌍',
    power: 70, accuracy: 80, pp: 10,
    type: 'attack', stat: 'atk',
    desc: 'Le sol tremble violemment',
    minLevel: 10,
  },
  meteore: {
    id: 'meteore', name: 'Chute de Meteore', element: 'earth', icon: '☄️',
    power: 110, accuracy: 65, pp: 3,
    type: 'attack', stat: 'atk',
    desc: 'Un rocher tombe du ciel',
    minLevel: 25,
  },

  // ===== WIND MOVES =====
  bourrasque: {
    id: 'bourrasque', name: 'Bourrasque', element: 'wind', icon: '💨',
    power: 30, accuracy: 95, pp: 20,
    type: 'attack', stat: 'spd',
    desc: 'Un courant d\'air tranchant',
  },
  tornade: {
    id: 'tornade', name: 'Tornade', element: 'wind', icon: '🌪️',
    power: 65, accuracy: 85, pp: 10,
    type: 'attack', stat: 'spd',
    desc: 'Un tourbillon devastateur',
    minLevel: 10,
  },
  tempete: {
    id: 'tempete', name: 'Tempete Celeste', element: 'wind', icon: '⛈️',
    power: 90, accuracy: 75, pp: 5,
    type: 'attack', stat: 'spd',
    desc: 'La fureur du ciel',
    minLevel: 25,
  },

  // ===== LIGHT MOVES =====
  eclair: {
    id: 'eclair', name: 'Eclair', element: 'light', icon: '✨',
    power: 30, accuracy: 95, pp: 20,
    type: 'attack', stat: 'int',
    desc: 'Un flash aveuglant',
  },
  rayon_solaire: {
    id: 'rayon_solaire', name: 'Rayon Solaire', element: 'light', icon: '☀️',
    power: 70, accuracy: 85, pp: 10,
    type: 'attack', stat: 'int',
    desc: 'La puissance du soleil concentree',
    minLevel: 10,
  },
  nova: {
    id: 'nova', name: 'Super Nova', element: 'light', icon: '💫',
    power: 100, accuracy: 70, pp: 3,
    type: 'attack', stat: 'int',
    desc: 'Explosion d\'energie pure',
    minLevel: 25,
  },

  // ===== SHADOW MOVES =====
  morsure: {
    id: 'morsure', name: 'Morsure Sombre', element: 'shadow', icon: '🌑',
    power: 30, accuracy: 95, pp: 20,
    type: 'attack', stat: 'cha',
    desc: 'Une attaque de l\'ombre',
  },
  cauchemar: {
    id: 'cauchemar', name: 'Cauchemar', element: 'shadow', icon: '👻',
    power: 60, accuracy: 90, pp: 10,
    type: 'attack', stat: 'cha',
    desc: 'Plonge l\'ennemi dans la terreur',
    minLevel: 10,
    special: 'fear', fearChance: 0.2,
  },
  abysse: {
    id: 'abysse', name: 'Abysse', element: 'shadow', icon: '🕳️',
    power: 95, accuracy: 75, pp: 5,
    type: 'attack', stat: 'cha',
    desc: 'L\'obscurite totale engloutit tout',
    minLevel: 25,
  },

  // ===== NEUTRAL / SUPPORT MOVES =====
  charge: {
    id: 'charge', name: 'Charge', element: 'neutral', icon: '💥',
    power: 25, accuracy: 100, pp: 25,
    type: 'attack', stat: 'atk',
    desc: 'Une attaque basique',
  },
  griffe: {
    id: 'griffe', name: 'Griffe', element: 'neutral', icon: '🐾',
    power: 35, accuracy: 90, pp: 20,
    type: 'attack', stat: 'atk',
    desc: 'Un coup de griffe rapide',
  },
  rugissement: {
    id: 'rugissement', name: 'Rugissement', element: 'neutral', icon: '📢',
    power: 0, accuracy: 100, pp: 15,
    type: 'buff', stat: 'atk',
    desc: 'Augmente ATK de 20%',
    buffAmount: 0.2, buffStat: 'atk',
  },
  bouclier: {
    id: 'bouclier', name: 'Bouclier', element: 'neutral', icon: '🛡️',
    power: 0, accuracy: 100, pp: 15,
    type: 'buff', stat: 'def',
    desc: 'Augmente DEF de 20%',
    buffAmount: 0.2, buffStat: 'def',
  },
  repos: {
    id: 'repos', name: 'Repos', element: 'neutral', icon: '💤',
    power: 0, accuracy: 100, pp: 5,
    type: 'heal',
    desc: 'Recupere 30% des PV max',
    healPercent: 0.3,
  },
  acceleration: {
    id: 'acceleration', name: 'Acceleration', element: 'neutral', icon: '⚡',
    power: 0, accuracy: 100, pp: 15,
    type: 'buff', stat: 'spd',
    desc: 'Augmente SPD de 30%',
    buffAmount: 0.3, buffStat: 'spd',
  },
  intimidation: {
    id: 'intimidation', name: 'Intimidation', element: 'neutral', icon: '😤',
    power: 0, accuracy: 85, pp: 10,
    type: 'debuff',
    desc: 'Reduit ATK ennemi de 20%',
    debuffAmount: 0.2, debuffStat: 'atk',
  },
}

// Get available moves for a creature based on element, level, and stats
export function getAvailableMoves(element, level, stats) {
  const available = []

  // Always available neutral moves
  available.push('charge', 'griffe')
  if (level >= 5) available.push('rugissement', 'bouclier')
  if (level >= 10) available.push('acceleration')
  if (level >= 15) available.push('repos', 'intimidation')

  // Element-specific moves
  const elementMoves = Object.values(MOVES).filter(m =>
    m.element === element && (!m.minLevel || level >= m.minLevel)
  )
  elementMoves.forEach(m => available.push(m.id))

  return [...new Set(available)]
}

// Type effectiveness chart
export const TYPE_CHART = {
  fire:   { fire: 0.5, water: 0.5, earth: 2.0, wind: 2.0, light: 1.0, shadow: 0.5, neutral: 1.0 },
  water:  { fire: 2.0, water: 0.5, earth: 0.5, wind: 0.5, light: 2.0, shadow: 1.0, neutral: 1.0 },
  earth:  { fire: 0.5, water: 2.0, earth: 0.5, wind: 0.5, light: 0.5, shadow: 2.0, neutral: 1.0 },
  wind:   { fire: 0.5, water: 2.0, earth: 2.0, wind: 0.5, light: 0.5, shadow: 1.0, neutral: 1.0 },
  light:  { fire: 1.0, water: 0.5, earth: 2.0, wind: 2.0, light: 0.5, shadow: 2.0, neutral: 1.0 },
  shadow: { fire: 2.0, water: 1.0, earth: 0.5, wind: 1.0, light: 0.5, shadow: 0.5, neutral: 1.0 },
  neutral:{ fire: 1.0, water: 1.0, earth: 1.0, wind: 1.0, light: 1.0, shadow: 1.0, neutral: 1.0 },
}

// Calculate damage
export function calculateDamage(attacker, defender, move) {
  const atkStat = attacker.stats[move.stat] || attacker.stats.atk
  const defStat = defender.stats.def

  // Base damage formula
  const levelFactor = (2 * attacker.level / 5 + 2)
  const baseDamage = ((levelFactor * move.power * (atkStat / defStat)) / 50) + 2

  // Type effectiveness
  const effectiveness = TYPE_CHART[move.element]?.[defender.element] || 1.0

  // STAB (Same Type Attack Bonus)
  const stab = move.element === attacker.element ? 1.5 : 1.0

  // Random variance (85-100%)
  const random = 0.85 + Math.random() * 0.15

  // Critical hit (based on SPD)
  const critChance = Math.min(0.25, attacker.stats.spd / 1000)
  const critical = Math.random() < critChance ? 1.5 : 1.0

  const totalDamage = Math.max(1, Math.floor(baseDamage * effectiveness * stab * random * critical))

  return {
    damage: totalDamage,
    effectiveness,
    critical: critical > 1,
    stab: stab > 1,
  }
}
