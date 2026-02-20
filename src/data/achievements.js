// Achievement system - rewards for dedicated players

export const ACHIEVEMENTS = {
  // ===== CARE ACHIEVEMENTS =====
  first_feed: {
    id: 'first_feed', name: 'Premier Repas', icon: '🍖',
    desc: 'Nourris ta creature pour la premiere fois',
    category: 'care', check: (s) => s.stats.totalFeedings >= 1,
    reward: { coins: 50 },
  },
  chef: {
    id: 'chef', name: 'Grand Chef', icon: '👨‍🍳',
    desc: 'Nourris ta creature 100 fois',
    category: 'care', check: (s) => s.stats.totalFeedings >= 100,
    reward: { coins: 500 },
  },
  gourmet: {
    id: 'gourmet', name: 'Gourmet', icon: '🍽️',
    desc: 'Nourris ta creature 1000 fois',
    category: 'care', check: (s) => s.stats.totalFeedings >= 1000,
    reward: { coins: 5000 },
  },
  clean_freak: {
    id: 'clean_freak', name: 'Maniaque de Proprete', icon: '🧹',
    desc: 'Nettoie 100 fois',
    category: 'care', check: (s) => s.stats.totalCleans >= 100,
    reward: { coins: 300 },
  },
  doctor: {
    id: 'doctor', name: 'Docteur Devoue', icon: '🏥',
    desc: 'Soigne 50 fois',
    category: 'care', check: (s) => s.stats.totalHeals >= 50,
    reward: { coins: 500 },
  },

  // ===== EVOLUTION ACHIEVEMENTS =====
  hatch: {
    id: 'hatch', name: 'Eclosion !', icon: '🥚',
    desc: 'Fais eclore l\'oeuf',
    category: 'evolution', check: (s) => s.creature.stage !== 'egg',
    reward: { coins: 100 },
  },
  junior_stage: {
    id: 'junior_stage', name: 'Junior', icon: '🧒',
    desc: 'Atteins le stade Junior',
    category: 'evolution', check: (s) => ['junior','teen','adult','champion','legendary'].includes(s.creature.stage),
    reward: { coins: 500 },
  },
  teen_stage: {
    id: 'teen_stage', name: 'Adolescent', icon: '🌟',
    desc: 'Atteins le stade Adolescent',
    category: 'evolution', check: (s) => ['teen','adult','champion','legendary'].includes(s.creature.stage),
    reward: { coins: 2000 },
  },
  adult_stage: {
    id: 'adult_stage', name: 'Adulte', icon: '💪',
    desc: 'Atteins le stade Adulte',
    category: 'evolution', check: (s) => ['adult','champion','legendary'].includes(s.creature.stage),
    reward: { coins: 10000 },
  },
  champion_stage: {
    id: 'champion_stage', name: 'Champion !', icon: '🏆',
    desc: 'Atteins le stade Champion',
    category: 'evolution', check: (s) => ['champion','legendary'].includes(s.creature.stage),
    reward: { coins: 50000 },
  },
  legendary_stage: {
    id: 'legendary_stage', name: 'Legendaire !', icon: '👑',
    desc: 'Atteins le stade Legendaire',
    category: 'evolution', check: (s) => s.creature.stage === 'legendary',
    reward: { coins: 500000 },
  },

  // ===== CLICKER ACHIEVEMENTS =====
  first_click: {
    id: 'first_click', name: 'Premier Clic', icon: '👆',
    desc: 'Clique pour la premiere fois',
    category: 'clicker', check: (s) => s.stats.totalClicks >= 1,
    reward: { coins: 10 },
  },
  clicker_100: {
    id: 'clicker_100', name: 'Clickeur', icon: '🖱️',
    desc: '100 clics',
    category: 'clicker', check: (s) => s.stats.totalClicks >= 100,
    reward: { coins: 100 },
  },
  clicker_1k: {
    id: 'clicker_1k', name: 'Clickeur Pro', icon: '💻',
    desc: '1 000 clics',
    category: 'clicker', check: (s) => s.stats.totalClicks >= 1000,
    reward: { coins: 1000 },
  },
  clicker_10k: {
    id: 'clicker_10k', name: 'Clickeur Fou', icon: '🤯',
    desc: '10 000 clics',
    category: 'clicker', check: (s) => s.stats.totalClicks >= 10000,
    reward: { coins: 10000 },
  },
  rich_1k: {
    id: 'rich_1k', name: 'Petit Magot', icon: '💰',
    desc: 'Possede 1 000 pieces',
    category: 'clicker', check: (s) => s.economy.coins >= 1000,
    reward: { coins: 100 },
  },
  rich_100k: {
    id: 'rich_100k', name: 'Riche', icon: '💎',
    desc: 'Possede 100 000 pieces',
    category: 'clicker', check: (s) => s.economy.coins >= 100000,
    reward: { coins: 5000 },
  },
  rich_1m: {
    id: 'rich_1m', name: 'Millionnaire', icon: '🤑',
    desc: 'Possede 1 000 000 pieces',
    category: 'clicker', check: (s) => s.economy.coins >= 1000000,
    reward: { coins: 50000 },
  },
  rich_1b: {
    id: 'rich_1b', name: 'Milliardaire', icon: '🏰',
    desc: 'Possede 1 000 000 000 pieces',
    category: 'clicker', check: (s) => s.economy.coins >= 1000000000,
    reward: { coins: 5000000 },
  },
  first_prestige: {
    id: 'first_prestige', name: 'Renaissance', icon: '🌅',
    desc: 'Effectue ton premier prestige',
    category: 'clicker', check: (s) => s.economy.prestigeLevel >= 1,
    reward: { stardust: 5 },
  },
  prestige_5: {
    id: 'prestige_5', name: 'Veterant', icon: '⭐',
    desc: 'Prestige 5 fois',
    category: 'clicker', check: (s) => s.economy.prestigeLevel >= 5,
    reward: { stardust: 25 },
  },

  // ===== BATTLE ACHIEVEMENTS =====
  first_win: {
    id: 'first_win', name: 'Premiere Victoire', icon: '⚔️',
    desc: 'Gagne ton premier combat',
    category: 'battle', check: (s) => s.battle.wins >= 1,
    reward: { coins: 200 },
  },
  warrior: {
    id: 'warrior', name: 'Guerrier', icon: '🗡️',
    desc: 'Gagne 10 combats',
    category: 'battle', check: (s) => s.battle.wins >= 10,
    reward: { coins: 2000 },
  },
  champion_fighter: {
    id: 'champion_fighter', name: 'Champion d\'Arene', icon: '🏟️',
    desc: 'Gagne 50 combats',
    category: 'battle', check: (s) => s.battle.wins >= 50,
    reward: { coins: 10000 },
  },
  streak_5: {
    id: 'streak_5', name: 'Serie de 5', icon: '🔥',
    desc: '5 victoires d\'affilee',
    category: 'battle', check: (s) => s.battle.bestStreak >= 5,
    reward: { coins: 1000 },
  },
  streak_10: {
    id: 'streak_10', name: 'Inarretable', icon: '💫',
    desc: '10 victoires d\'affilee',
    category: 'battle', check: (s) => s.battle.bestStreak >= 10,
    reward: { coins: 5000 },
  },

  // ===== STAT ACHIEVEMENTS =====
  stat_100: {
    id: 'stat_100', name: 'Specialiste', icon: '📊',
    desc: 'Une stat atteint 100',
    category: 'stats', check: (s) => Object.values(s.creature.stats).some(v => v >= 100),
    reward: { coins: 1000 },
  },
  stat_500: {
    id: 'stat_500', name: 'Expert', icon: '📈',
    desc: 'Une stat atteint 500',
    category: 'stats', check: (s) => Object.values(s.creature.stats).some(v => v >= 500),
    reward: { coins: 10000 },
  },
  stat_999: {
    id: 'stat_999', name: 'Perfection', icon: '💯',
    desc: 'Une stat atteint 999',
    category: 'stats', check: (s) => Object.values(s.creature.stats).some(v => v >= 999),
    reward: { coins: 100000 },
  },
  all_stats_100: {
    id: 'all_stats_100', name: 'Polyvalent', icon: '🌈',
    desc: 'Toutes les stats a 100+',
    category: 'stats', check: (s) => Object.values(s.creature.stats).every(v => v >= 100),
    reward: { coins: 5000 },
  },

  // ===== TIME ACHIEVEMENTS =====
  play_1h: {
    id: 'play_1h', name: 'Premiere Heure', icon: '⏰',
    desc: 'Joue pendant 1 heure',
    category: 'time', check: (s) => s.stats.totalPlayTime >= 3600,
    reward: { coins: 200 },
  },
  play_24h: {
    id: 'play_24h', name: 'Un Jour Complet', icon: '📅',
    desc: 'Joue pendant 24 heures (cumule)',
    category: 'time', check: (s) => s.stats.totalPlayTime >= 86400,
    reward: { coins: 5000 },
  },
  play_7d: {
    id: 'play_7d', name: 'Une Semaine', icon: '📆',
    desc: '7 jours de jeu cumules',
    category: 'time', check: (s) => s.stats.totalPlayTime >= 604800,
    reward: { coins: 25000 },
  },
  play_30d: {
    id: 'play_30d', name: 'Un Mois !', icon: '🗓️',
    desc: '30 jours de jeu cumules',
    category: 'time', check: (s) => s.stats.totalPlayTime >= 2592000,
    reward: { coins: 100000 },
  },
  daily_streak_7: {
    id: 'daily_streak_7', name: 'Assidu', icon: '📌',
    desc: '7 jours consecutifs de connexion',
    category: 'time', check: (s) => s.stats.dailyStreak >= 7,
    reward: { coins: 1000 },
  },
  daily_streak_30: {
    id: 'daily_streak_30', name: 'Fidele', icon: '🏅',
    desc: '30 jours consecutifs',
    category: 'time', check: (s) => s.stats.dailyStreak >= 30,
    reward: { coins: 10000 },
  },
}

export const ACHIEVEMENT_CATEGORIES = {
  care: { name: 'Soins', icon: '❤️' },
  evolution: { name: 'Evolution', icon: '🧬' },
  clicker: { name: 'Clicker', icon: '💰' },
  battle: { name: 'Combat', icon: '⚔️' },
  stats: { name: 'Stats', icon: '📊' },
  time: { name: 'Temps', icon: '⏰' },
}
