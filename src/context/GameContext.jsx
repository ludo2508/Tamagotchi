import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { STAGES, DECAY_RATES, STAT_GROWTH, TRAITS, ELEMENTS, MAX_STATS, LEVEL_EXP } from '../data/creatures'
import { CLICKER_UPGRADES, getUpgradeCost, CLICK_UPGRADES, GOLDEN_CLICK, COMBO_CONFIG, calculateStardust, PRESTIGE_UPGRADES } from '../data/upgrades'
import { FOOD_ITEMS, EQUIPMENT, CARE_ITEMS, STAGE_ORDER, isStageUnlocked } from '../data/items'
import { MOVES, getAvailableMoves, calculateDamage, TYPE_CHART } from '../data/moves'
import { ACHIEVEMENTS } from '../data/achievements'
import { clamp } from '../utils/formatters'

const GameContext = createContext(null)

// ============================================
// INITIAL STATE
// ============================================
function createInitialState() {
  return {
    creature: {
      name: 'Evoli',
      stage: 'egg',
      element: null,
      age: 0, // hours
      birthday: Date.now(),
      eggClicks: 0,

      // Needs (0-100)
      hunger: 100,
      happiness: 100,
      hygiene: 100,
      energy: 100,
      health: 100,

      // Combat stats (0-999)
      stats: { vit: 10, atk: 10, def: 10, spd: 10, int: 10, cha: 10 },
      statExp: { vit: 0, atk: 0, def: 0, spd: 0, int: 0, cha: 0 },

      level: 1,
      exp: 0,

      traits: [],
      moves: ['charge', 'griffe'],

      equipment: { weapon: null, armor: null, accessory: null },

      hasPoop: false,
      animationFrame: 0,
      position: 0,

      // Element affinity points (determines type on evolution)
      elementAffinity: { fire: 0, water: 0, earth: 0, wind: 0, light: 0, shadow: 0 },
    },

    economy: {
      coins: 0,
      totalCoinsEarned: 0,
      clickPower: 1,
      clickMultiplierLevel: 0, // index into CLICK_UPGRADES
      coinsPerSecond: 0,
      totalClicks: 0,

      // Prestige system
      prestigeLevel: 0,
      prestigeMultiplier: 1,
      stardust: 0,
      stardustEarned: 0,
      prestigeUpgrades: {},

      // Upgrade counts
      upgrades: {},

      // Golden click
      goldenClickActive: false,
      goldenClickEnd: 0,
      lastGoldenClick: 0,

      // Combo
      comboCount: 0,
      lastClickTime: 0,
      bestCombo: 0,
    },

    battle: {
      active: false,
      opponent: null,
      playerHP: 0,
      playerMaxHP: 0,
      opponentHP: 0,
      opponentMaxHP: 0,
      turn: 'player',
      log: [],
      wins: 0,
      losses: 0,
      streak: 0,
      bestStreak: 0,
      rank: 'Bronze',
      battleCooldown: 0,
      playerBuffs: {},
      opponentBuffs: {},
    },

    inventory: {},

    achievements: {},

    stats: {
      totalPlayTime: 0,
      totalFeedings: 0,
      totalCleans: 0,
      totalHeals: 0,
      totalTrainings: 0,
      totalBattles: 0,
      totalPlays: 0,
      creaturesEvolved: 0,
      dailyStreak: 0,
      lastLoginDate: null,
      totalClicks: 0,
    },

    settings: {
      timeSpeed: 1,
    },

    ui: {
      activeTab: 'habitat',
      message: null,
      messageTimeout: null,
      notifications: [],
    },

    lastUpdate: Date.now(),
    gameStarted: Date.now(),
  }
}

// ============================================
// REDUCER
// ============================================
function gameReducer(state, action) {
  switch (action.type) {
    // ---- CORE ----
    case 'TICK':
      return handleTick(state, action.payload)

    case 'LOAD_SAVE':
      return { ...action.payload, ui: { ...createInitialState().ui } }

    case 'RESET_GAME':
      return createInitialState()

    // ---- CREATURE ----
    case 'CLICK_EGG': {
      const newClicks = state.creature.eggClicks + 1
      if (newClicks >= 10) {
        // Hatch! Assign random traits
        const traitKeys = Object.keys(TRAITS)
        const trait1 = traitKeys[Math.floor(Math.random() * traitKeys.length)]
        let trait2 = traitKeys[Math.floor(Math.random() * traitKeys.length)]
        while (trait2 === trait1) trait2 = traitKeys[Math.floor(Math.random() * traitKeys.length)]

        return {
          ...state,
          creature: {
            ...state.creature,
            stage: 'baby',
            eggClicks: 0,
            traits: [trait1, trait2],
            birthday: Date.now(),
          },
          ui: { ...state.ui, message: '🥚 L\'oeuf a eclos ! Bienvenue petit Evoli !' },
        }
      }
      return {
        ...state,
        creature: { ...state.creature, eggClicks: newClicks },
      }
    }

    case 'RENAME_CREATURE':
      return { ...state, creature: { ...state.creature, name: action.payload } }

    // ---- CARE ----
    case 'FEED': {
      const food = FOOD_ITEMS[action.payload]
      if (!food || state.economy.coins < food.price) return state

      const newStats = { ...state.creature.stats }
      const newStatExp = { ...state.creature.statExp }
      if (food.statBonus) {
        Object.entries(food.statBonus).forEach(([stat, val]) => {
          const traitMul = getTraitMultiplier(state.creature.traits, `${stat}Growth`)
          newStatExp[stat] = (newStatExp[stat] || 0) + val * traitMul
        })
      }

      // Check for stat level ups from exp
      Object.keys(newStatExp).forEach(stat => {
        const threshold = 10 + newStats[stat] * 0.5
        while (newStatExp[stat] >= threshold && newStats[stat] < getMaxStat(state.creature.stage)) {
          newStatExp[stat] -= threshold
          newStats[stat] += 1
        }
      })

      // Element affinity
      const newAffinity = { ...state.creature.elementAffinity }
      if (food.elementBonus) {
        newAffinity[food.elementBonus] = (newAffinity[food.elementBonus] || 0) + 5
      }

      return {
        ...state,
        economy: {
          ...state.economy,
          coins: state.economy.coins - food.price,
        },
        creature: {
          ...state.creature,
          hunger: clamp(state.creature.hunger + (food.effects.hunger || 0)),
          happiness: clamp(state.creature.happiness + (food.effects.happiness || 0)),
          health: clamp(state.creature.health + (food.effects.health || 0)),
          energy: clamp(state.creature.energy + (food.effects.energy || 0)),
          hygiene: clamp(state.creature.hygiene + (food.effects.hygiene || 0)),
          stats: newStats,
          statExp: newStatExp,
          elementAffinity: newAffinity,
        },
        stats: { ...state.stats, totalFeedings: state.stats.totalFeedings + 1 },
        ui: { ...state.ui, message: `${food.icon} ${food.name} donne !` },
      }
    }

    case 'USE_CARE_ITEM': {
      const item = CARE_ITEMS[action.payload]
      if (!item || state.economy.coins < item.price) return state

      return {
        ...state,
        economy: { ...state.economy, coins: state.economy.coins - item.price },
        creature: {
          ...state.creature,
          hunger: clamp(state.creature.hunger + (item.effects.hunger || 0)),
          happiness: clamp(state.creature.happiness + (item.effects.happiness || 0)),
          health: clamp(state.creature.health + (item.effects.health || 0)),
          energy: clamp(state.creature.energy + (item.effects.energy || 0)),
          hygiene: clamp(state.creature.hygiene + (item.effects.hygiene || 0)),
          hasPoop: item.effects.hygiene > 0 ? false : state.creature.hasPoop,
        },
        stats: {
          ...state.stats,
          totalCleans: state.stats.totalCleans + (item.effects.hygiene > 0 ? 1 : 0),
          totalHeals: state.stats.totalHeals + (item.effects.health > 0 ? 1 : 0),
          totalPlays: state.stats.totalPlays + (item.effects.happiness > 0 ? 1 : 0),
        },
        ui: { ...state.ui, message: `${item.icon} ${item.name} utilise !` },
      }
    }

    case 'TRAIN': {
      const { stat: trainStat, cost } = action.payload
      if (state.economy.coins < cost || state.creature.energy < 10) return state
      if (state.creature.stage === 'egg' || state.creature.stage === 'baby') return state

      const growth = STAT_GROWTH[state.creature.stage] || STAT_GROWTH.junior
      const traitMul = getTraitMultiplier(state.creature.traits, `${trainStat}Growth`)
      const expGain = growth.base * growth.multiplier * traitMul
      const maxStat = getMaxStat(state.creature.stage)

      const newStatExp = { ...state.creature.statExp }
      const newStats = { ...state.creature.stats }
      newStatExp[trainStat] += expGain

      const threshold = 10 + newStats[trainStat] * 0.5
      while (newStatExp[trainStat] >= threshold && newStats[trainStat] < maxStat) {
        newStatExp[trainStat] -= threshold
        newStats[trainStat] += 1
      }

      // Training gives some exp too
      const newExp = state.creature.exp + growth.base * 2
      let newLevel = state.creature.level
      let expRemaining = newExp
      while (expRemaining >= LEVEL_EXP(newLevel)) {
        expRemaining -= LEVEL_EXP(newLevel)
        newLevel++
      }

      // Element affinity based on stat trained
      const newAffinity = { ...state.creature.elementAffinity }
      const elementMap = { atk: 'fire', def: 'water', vit: 'earth', spd: 'wind', int: 'light', cha: 'shadow' }
      if (elementMap[trainStat]) {
        newAffinity[elementMap[trainStat]] += 1
      }

      return {
        ...state,
        economy: { ...state.economy, coins: state.economy.coins - cost },
        creature: {
          ...state.creature,
          stats: newStats,
          statExp: newStatExp,
          energy: clamp(state.creature.energy - 15),
          happiness: clamp(state.creature.happiness + 3),
          level: newLevel,
          exp: expRemaining,
          elementAffinity: newAffinity,
        },
        stats: { ...state.stats, totalTrainings: state.stats.totalTrainings + 1 },
        ui: { ...state.ui, message: `💪 Entrainement ${trainStat.toUpperCase()} ! +${expGain.toFixed(1)} exp` },
      }
    }

    case 'CLEAN': {
      const cost = getCareCost(state.creature.stage, 'clean')
      if (state.economy.coins < cost) return state
      return {
        ...state,
        economy: { ...state.economy, coins: state.economy.coins - cost },
        creature: { ...state.creature, hygiene: 100, hasPoop: false },
        stats: { ...state.stats, totalCleans: state.stats.totalCleans + 1 },
        ui: { ...state.ui, message: '✨ Tout propre !' },
      }
    }

    case 'HEAL': {
      const cost = getCareCost(state.creature.stage, 'heal')
      if (state.economy.coins < cost) return state
      return {
        ...state,
        economy: { ...state.economy, coins: state.economy.coins - cost },
        creature: { ...state.creature, health: 100 },
        stats: { ...state.stats, totalHeals: state.stats.totalHeals + 1 },
        ui: { ...state.ui, message: '💊 En pleine forme !' },
      }
    }

    case 'REST': {
      if (state.creature.energy > 80) return { ...state, ui: { ...state.ui, message: 'Pas fatigue !' } }
      return {
        ...state,
        creature: {
          ...state.creature,
          energy: clamp(state.creature.energy + 40),
          happiness: clamp(state.creature.happiness + 5),
        },
        ui: { ...state.ui, message: '💤 Bonne sieste !' },
      }
    }

    case 'PLAY': {
      const cost = getCareCost(state.creature.stage, 'play')
      if (state.economy.coins < cost || state.creature.energy < 10) return state

      const happinessGain = 20 * getTraitMultiplier(state.creature.traits, 'happinessFromPlay')
      return {
        ...state,
        economy: { ...state.economy, coins: state.economy.coins - cost },
        creature: {
          ...state.creature,
          happiness: clamp(state.creature.happiness + happinessGain),
          energy: clamp(state.creature.energy - 10),
          statExp: {
            ...state.creature.statExp,
            spd: state.creature.statExp.spd + 0.5,
            cha: state.creature.statExp.cha + 0.3,
          },
        },
        stats: { ...state.stats, totalPlays: state.stats.totalPlays + 1 },
        ui: { ...state.ui, message: '🎮 Trop fun !' },
      }
    }

    // ---- CLICKER ----
    case 'CLICK': {
      const now = Date.now()
      const timeSinceLastClick = now - state.economy.lastClickTime

      // Combo system
      let newCombo = state.economy.comboCount
      const maxCombo = COMBO_CONFIG.baseMax + (state.economy.prestigeUpgrades?.p_combo || 0) * COMBO_CONFIG.bonusPerLevel
      if (timeSinceLastClick < COMBO_CONFIG.timeout) {
        newCombo = Math.min(newCombo + 1, maxCombo)
      } else {
        newCombo = 0
      }

      // Calculate click value
      const baseClickPower = state.economy.clickPower
      const clickMultiplier = CLICK_UPGRADES[state.economy.clickMultiplierLevel]?.multiplier || 1
      const prestigeClickBonus = 1 + (state.economy.prestigeUpgrades?.p_click || 0) * 0.25
      const comboBonus = 1 + newCombo * COMBO_CONFIG.bonusPerLevel
      const goldenBonus = state.economy.goldenClickActive ? GOLDEN_CLICK.multiplier : 1
      const critBonus = Math.random() < (state.economy.prestigeUpgrades?.p_crit || 0) * 0.05 ? 10 : 1

      const earnedCoins = Math.floor(baseClickPower * clickMultiplier * prestigeClickBonus * comboBonus * goldenBonus * critBonus * state.settings.timeSpeed)

      return {
        ...state,
        economy: {
          ...state.economy,
          coins: state.economy.coins + earnedCoins,
          totalCoinsEarned: state.economy.totalCoinsEarned + earnedCoins,
          totalClicks: state.economy.totalClicks + 1,
          comboCount: newCombo,
          lastClickTime: now,
          bestCombo: Math.max(state.economy.bestCombo, newCombo),
        },
        stats: { ...state.stats, totalClicks: state.stats.totalClicks + 1 },
      }
    }

    case 'BUY_UPGRADE': {
      const { upgradeIndex } = action.payload
      const upgrade = CLICKER_UPGRADES[upgradeIndex]
      if (!upgrade) return state

      const owned = state.economy.upgrades[upgrade.id] || 0
      const cost = getUpgradeCost(upgrade, owned)

      if (state.economy.coins < cost) return state

      const newUpgrades = { ...state.economy.upgrades, [upgrade.id]: owned + 1 }

      // Recalculate CPS
      const cps = calculateCPS(newUpgrades, state.economy.prestigeMultiplier, state.economy.prestigeUpgrades)

      return {
        ...state,
        economy: {
          ...state.economy,
          coins: state.economy.coins - cost,
          upgrades: newUpgrades,
          coinsPerSecond: cps,
        },
      }
    }

    case 'BUY_CLICK_UPGRADE': {
      const nextLevel = state.economy.clickMultiplierLevel + 1
      const upgrade = CLICK_UPGRADES[nextLevel]
      if (!upgrade || state.economy.coins < upgrade.cost) return state

      return {
        ...state,
        economy: {
          ...state.economy,
          coins: state.economy.coins - upgrade.cost,
          clickMultiplierLevel: nextLevel,
          clickPower: upgrade.multiplier,
        },
        ui: { ...state.ui, message: `⚡ ${upgrade.name} debloque !` },
      }
    }

    case 'PRESTIGE': {
      const newStardust = calculateStardust(state.economy.totalCoinsEarned)
      if (newStardust <= 0) return state

      const newPrestigeLevel = state.economy.prestigeLevel + 1
      const totalStardust = state.economy.stardust + newStardust

      // Keep creature, battle stats, achievements, inventory
      return {
        ...state,
        economy: {
          ...createInitialState().economy,
          prestigeLevel: newPrestigeLevel,
          prestigeMultiplier: 1 + newPrestigeLevel * 0.1,
          stardust: totalStardust,
          stardustEarned: state.economy.stardustEarned + newStardust,
          prestigeUpgrades: state.economy.prestigeUpgrades,
          // Free upgrades from prestige
          upgrades: state.economy.prestigeUpgrades?.p_start
            ? { cursor: (state.economy.prestigeUpgrades.p_start || 0) * 5 }
            : {},
        },
        ui: { ...state.ui, message: `🌟 Prestige ${newPrestigeLevel} ! +${newStardust} poussiere d'etoile` },
      }
    }

    case 'BUY_PRESTIGE_UPGRADE': {
      const pUpgrade = PRESTIGE_UPGRADES.find(u => u.id === action.payload)
      if (!pUpgrade) return state

      const currentLevel = state.economy.prestigeUpgrades[pUpgrade.id] || 0
      if (currentLevel >= pUpgrade.maxLevel) return state
      if (state.economy.stardust < pUpgrade.cost) return state

      const newPrestigeUpgrades = {
        ...state.economy.prestigeUpgrades,
        [pUpgrade.id]: currentLevel + 1,
      }

      // Recalculate CPS with new prestige bonuses
      const cps = calculateCPS(state.economy.upgrades, state.economy.prestigeMultiplier, newPrestigeUpgrades)

      return {
        ...state,
        economy: {
          ...state.economy,
          stardust: state.economy.stardust - pUpgrade.cost,
          prestigeUpgrades: newPrestigeUpgrades,
          coinsPerSecond: cps,
        },
        ui: { ...state.ui, message: `💫 ${pUpgrade.name} ameliore !` },
      }
    }

    case 'GOLDEN_CLICK_START':
      return {
        ...state,
        economy: {
          ...state.economy,
          goldenClickActive: true,
          goldenClickEnd: Date.now() + GOLDEN_CLICK.duration * 1000,
          lastGoldenClick: Date.now(),
        },
        ui: { ...state.ui, message: '🌟 GOLDEN CLICK ! x7 pendant 15s !' },
      }

    case 'GOLDEN_CLICK_END':
      return {
        ...state,
        economy: { ...state.economy, goldenClickActive: false },
      }

    // ---- BATTLE ----
    case 'START_BATTLE': {
      if (state.creature.stage === 'egg' || state.creature.stage === 'baby') return state
      if (state.creature.energy < 20) return { ...state, ui: { ...state.ui, message: 'Pas assez d\'energie pour combattre !' } }

      const opponent = generateOpponent(state.creature)
      const playerMaxHP = calculateHP(state.creature)
      const opponentMaxHP = calculateHP(opponent)

      return {
        ...state,
        battle: {
          ...state.battle,
          active: true,
          opponent,
          playerHP: playerMaxHP,
          playerMaxHP,
          opponentHP: opponentMaxHP,
          opponentMaxHP,
          turn: state.creature.stats.spd >= opponent.stats.spd ? 'player' : 'opponent',
          log: [`Combat contre ${opponent.name} (${ELEMENTS[opponent.element]?.icon || '?'} Niv.${opponent.level}) !`],
          playerBuffs: {},
          opponentBuffs: {},
        },
        creature: { ...state.creature, energy: clamp(state.creature.energy - 20) },
      }
    }

    case 'BATTLE_MOVE': {
      if (!state.battle.active || state.battle.turn !== 'player') return state

      const move = MOVES[action.payload]
      if (!move) return state

      let newState = { ...state }
      const log = [...state.battle.log]

      // Player attacks
      const result = executeBattleMove(state.creature, state.battle.opponent, move, state.battle.playerBuffs, state.battle.opponentBuffs)
      log.push(result.message)

      let newOpponentHP = state.battle.opponentHP - (result.damage || 0)
      let newPlayerHP = state.battle.playerHP
      let newPlayerBuffs = { ...state.battle.playerBuffs, ...result.playerBuffs }
      let newOpponentBuffs = { ...state.battle.opponentBuffs, ...result.opponentBuffs }

      if (result.heal) {
        newPlayerHP = Math.min(state.battle.playerMaxHP, newPlayerHP + result.heal)
        log.push(`💚 +${result.heal} PV recuperes`)
      }

      // Check if opponent is defeated
      if (newOpponentHP <= 0) {
        const coinReward = Math.floor(50 * state.battle.opponent.level * (1 + state.battle.streak * 0.1))
        const expReward = Math.floor(20 * state.battle.opponent.level)
        log.push(`🎉 Victoire ! +${coinReward} pieces, +${expReward} EXP`)

        // Level up check
        let newLevel = state.creature.level
        let newExp = state.creature.exp + expReward
        while (newExp >= LEVEL_EXP(newLevel)) {
          newExp -= LEVEL_EXP(newLevel)
          newLevel++
        }

        const newStreak = state.battle.streak + 1
        return {
          ...state,
          battle: {
            ...state.battle,
            active: false,
            opponentHP: 0,
            log,
            wins: state.battle.wins + 1,
            streak: newStreak,
            bestStreak: Math.max(state.battle.bestStreak, newStreak),
            rank: calculateRank(state.battle.wins + 1),
          },
          economy: {
            ...state.economy,
            coins: state.economy.coins + coinReward,
            totalCoinsEarned: state.economy.totalCoinsEarned + coinReward,
          },
          creature: { ...state.creature, level: newLevel, exp: newExp },
          stats: { ...state.stats, totalBattles: state.stats.totalBattles + 1 },
          ui: { ...state.ui, message: `⚔️ Victoire ! +${coinReward} pieces` },
        }
      }

      // Opponent's turn
      const oppMoves = state.battle.opponent.moves.filter(m => MOVES[m])
      const oppMoveId = oppMoves[Math.floor(Math.random() * oppMoves.length)] || 'charge'
      const oppMove = MOVES[oppMoveId]
      const oppResult = executeBattleMove(state.battle.opponent, state.creature, oppMove, newOpponentBuffs, newPlayerBuffs)
      log.push(oppResult.message)

      newPlayerHP -= oppResult.damage || 0
      newPlayerBuffs = { ...newPlayerBuffs, ...oppResult.opponentBuffs }
      newOpponentBuffs = { ...newOpponentBuffs, ...oppResult.playerBuffs }

      if (oppResult.heal) {
        newOpponentHP = Math.min(state.battle.opponentMaxHP, newOpponentHP + oppResult.heal)
      }

      // Check if player is defeated
      if (newPlayerHP <= 0) {
        log.push('💀 Defaite...')
        return {
          ...state,
          battle: {
            ...state.battle,
            playerHP: 0,
            opponentHP: newOpponentHP,
            active: false,
            log,
            losses: state.battle.losses + 1,
            streak: 0,
          },
          stats: { ...state.stats, totalBattles: state.stats.totalBattles + 1 },
          ui: { ...state.ui, message: '💀 Defaite...' },
        }
      }

      return {
        ...state,
        battle: {
          ...state.battle,
          playerHP: newPlayerHP,
          opponentHP: newOpponentHP,
          log,
          playerBuffs: newPlayerBuffs,
          opponentBuffs: newOpponentBuffs,
        },
      }
    }

    case 'FLEE_BATTLE':
      return {
        ...state,
        battle: { ...state.battle, active: false, log: [...state.battle.log, '🏃 Fuite !'], streak: 0 },
        ui: { ...state.ui, message: 'Fuite du combat !' },
      }

    // ---- SHOP ----
    case 'BUY_EQUIPMENT': {
      const equip = EQUIPMENT[action.payload]
      if (!equip || state.economy.coins < equip.price) return state
      if (!isStageUnlocked(state.creature.stage, equip.minStage)) return state

      const newInventory = { ...state.inventory }
      if (!newInventory[equip.id]) newInventory[equip.id] = 0
      newInventory[equip.id]++

      return {
        ...state,
        economy: { ...state.economy, coins: state.economy.coins - equip.price },
        inventory: newInventory,
        ui: { ...state.ui, message: `${equip.icon} ${equip.name} achete !` },
      }
    }

    case 'EQUIP_ITEM': {
      const { itemId, slot } = action.payload
      const equip = EQUIPMENT[itemId]
      if (!equip || equip.slot !== slot) return state
      if (!state.inventory[itemId] || state.inventory[itemId] <= 0) return state

      // Unequip current item (add back to inventory)
      const newInventory = { ...state.inventory }
      const currentEquip = state.creature.equipment[slot]
      if (currentEquip) {
        newInventory[currentEquip] = (newInventory[currentEquip] || 0) + 1
      }

      // Equip new item (remove from inventory)
      newInventory[itemId]--
      if (newInventory[itemId] <= 0) delete newInventory[itemId]

      return {
        ...state,
        creature: {
          ...state.creature,
          equipment: { ...state.creature.equipment, [slot]: itemId },
        },
        inventory: newInventory,
        ui: { ...state.ui, message: `${equip.icon} ${equip.name} equipe !` },
      }
    }

    // ---- ACHIEVEMENTS ----
    case 'UNLOCK_ACHIEVEMENT': {
      const achId = action.payload
      const ach = ACHIEVEMENTS[achId]
      if (!ach || state.achievements[achId]) return state

      let newState = {
        ...state,
        achievements: { ...state.achievements, [achId]: { unlocked: true, date: Date.now() } },
      }

      // Apply rewards
      if (ach.reward) {
        if (ach.reward.coins) {
          newState.economy = { ...newState.economy, coins: newState.economy.coins + ach.reward.coins }
        }
        if (ach.reward.stardust) {
          newState.economy = { ...newState.economy, stardust: newState.economy.stardust + ach.reward.stardust }
        }
      }

      newState.ui = {
        ...newState.ui,
        notifications: [...(newState.ui.notifications || []),
          { type: 'achievement', id: achId, text: `🏆 ${ach.name}`, time: Date.now() }
        ],
      }

      return newState
    }

    // ---- UI ----
    case 'SET_TAB':
      return { ...state, ui: { ...state.ui, activeTab: action.payload } }

    case 'SET_MESSAGE':
      return { ...state, ui: { ...state.ui, message: action.payload } }

    case 'CLEAR_MESSAGE':
      return { ...state, ui: { ...state.ui, message: null } }

    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter((_, i) => i !== action.payload),
        },
      }

    case 'SET_TIME_SPEED':
      return { ...state, settings: { ...state.settings, timeSpeed: action.payload } }

    case 'UPDATE_ANIMATION':
      return {
        ...state,
        creature: {
          ...state.creature,
          animationFrame: (state.creature.animationFrame + 1) % 4,
          position: state.creature.position === 0 ? 5 : 0,
        },
      }

    default:
      return state
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getTraitMultiplier(traits, effectKey) {
  let mul = 1
  traits.forEach(traitId => {
    const trait = TRAITS[traitId]
    if (trait && trait.effect[effectKey]) {
      mul *= trait.effect[effectKey]
    }
  })
  return mul
}

function getMaxStat(stage) {
  return MAX_STATS[stage] || 50
}

function getCareCost(stage, action) {
  const baseCosts = { clean: 8, heal: 50, play: 15 }
  const stageMultiplier = { baby: 1, junior: 1.5, teen: 2, adult: 3, champion: 4, legendary: 5 }
  return Math.floor((baseCosts[action] || 10) * (stageMultiplier[stage] || 1))
}

function calculateCPS(upgrades, prestigeMultiplier, prestigeUpgrades = {}) {
  let cps = 0
  CLICKER_UPGRADES.forEach(upgrade => {
    const count = upgrades[upgrade.id] || 0
    cps += count * upgrade.baseProduction
  })
  const productionBonus = 1 + (prestigeUpgrades.p_production || 0) * 0.10
  return cps * prestigeMultiplier * productionBonus
}

function calculateHP(creature) {
  const baseHP = 50
  const vitBonus = creature.stats.vit * 3
  const levelBonus = creature.level * 5
  // Equipment bonus
  let equipBonus = 0
  Object.values(creature.equipment || {}).forEach(eqId => {
    if (eqId && EQUIPMENT[eqId]) {
      equipBonus += (EQUIPMENT[eqId].stats.vit || 0) * 2
    }
  })
  return baseHP + vitBonus + levelBonus + equipBonus
}

function calculateRank(wins) {
  if (wins >= 200) return 'Legendaire'
  if (wins >= 100) return 'Maitre'
  if (wins >= 50) return 'Diamant'
  if (wins >= 25) return 'Platine'
  if (wins >= 10) return 'Or'
  if (wins >= 5) return 'Argent'
  return 'Bronze'
}

function generateOpponent(playerCreature) {
  const elements = Object.keys(ELEMENTS)
  const element = elements[Math.floor(Math.random() * elements.length)]
  const levelVariance = Math.floor(Math.random() * 5) - 2
  const level = Math.max(1, playerCreature.level + levelVariance)

  const names = [
    'Flamby', 'Aquari', 'Terrok', 'Zephyr', 'Solaris', 'Umbra',
    'Pyra', 'Naiad', 'Golem', 'Sylph', 'Lux', 'Nox',
    'Ignis', 'Ondine', 'Gaia', 'Eole', 'Helios', 'Selene',
    'Vulcain', 'Triton', 'Atlas', 'Borée', 'Apollo', 'Hades',
  ]
  const name = names[Math.floor(Math.random() * names.length)]

  // Generate stats based on level and element affinity
  const statBase = Math.floor(level * 4 + 10)
  const affinity = ELEMENTS[element].statAffinity
  const stats = {
    vit: statBase + (affinity === 'vit' ? level * 2 : 0),
    atk: statBase + (affinity === 'atk' ? level * 2 : 0),
    def: statBase + (affinity === 'def' ? level * 2 : 0),
    spd: statBase + (affinity === 'spd' ? level * 2 : 0),
    int: statBase + (affinity === 'int' ? level * 2 : 0),
    cha: statBase + (affinity === 'cha' ? level * 2 : 0),
  }

  // Pick moves
  const availableMoves = getAvailableMoves(element, level, stats)
  const moves = availableMoves.slice(0, 4)

  return {
    name,
    element,
    level,
    stats,
    moves,
    equipment: {},
  }
}

function executeBattleMove(attacker, defender, move, attackerBuffs, defenderBuffs) {
  const result = { damage: 0, message: '', playerBuffs: {}, opponentBuffs: {}, heal: 0 }
  const atkName = attacker.name || 'Ennemi'

  // Accuracy check
  if (Math.random() * 100 > move.accuracy) {
    result.message = `${atkName} utilise ${move.name}... Rate !`
    return result
  }

  if (move.type === 'attack') {
    // Apply buffs to stats temporarily
    const buffedAttacker = applyBuffs(attacker, attackerBuffs)
    const buffedDefender = applyBuffs(defender, defenderBuffs)

    const dmgResult = calculateDamage(buffedAttacker, buffedDefender, move)
    result.damage = dmgResult.damage

    let msg = `${atkName} utilise ${move.icon} ${move.name} ! -${dmgResult.damage} PV`
    if (dmgResult.critical) msg += ' CRITIQUE !'
    if (dmgResult.effectiveness > 1) msg += ' Super efficace !'
    if (dmgResult.effectiveness < 1) msg += ' Peu efficace...'
    result.message = msg

    // Drain moves
    if (move.special === 'drain') {
      result.heal = Math.floor(dmgResult.damage * move.drainPercent)
    }

  } else if (move.type === 'buff') {
    result.playerBuffs = { [move.buffStat]: (attackerBuffs[move.buffStat] || 0) + move.buffAmount }
    result.message = `${atkName} utilise ${move.icon} ${move.name} ! ${move.buffStat.toUpperCase()} +${Math.floor(move.buffAmount * 100)}%`

  } else if (move.type === 'debuff') {
    result.opponentBuffs = { [move.debuffStat]: (defenderBuffs[move.debuffStat] || 0) - move.debuffAmount }
    result.message = `${atkName} utilise ${move.icon} ${move.name} ! ${move.debuffStat.toUpperCase()} ennemi -${Math.floor(move.debuffAmount * 100)}%`

  } else if (move.type === 'heal') {
    const maxHP = calculateHP(attacker)
    result.heal = Math.floor(maxHP * move.healPercent)
    result.message = `${atkName} utilise ${move.icon} ${move.name} !`
  }

  return result
}

function applyBuffs(creature, buffs) {
  const newStats = { ...creature.stats }
  Object.entries(buffs).forEach(([stat, bonus]) => {
    if (newStats[stat]) {
      newStats[stat] = Math.floor(newStats[stat] * (1 + bonus))
    }
  })
  return { ...creature, stats: newStats }
}

// ============================================
// GAME TICK - Called every second
// ============================================
function handleTick(state, { deltaSeconds }) {
  if (state.creature.stage === 'egg') return state

  const speed = state.settings.timeSpeed
  const minutes = (deltaSeconds * speed) / 60
  const stage = state.creature.stage

  // Stat decay
  const decayMultiplier = speed
  const newHunger = clamp(state.creature.hunger - (DECAY_RATES.hunger.stages[stage] || 1) * minutes)
  const newHappiness = clamp(state.creature.happiness - (DECAY_RATES.happiness.stages[stage] || 0.8) * minutes)
  const newHygiene = clamp(state.creature.hygiene - (DECAY_RATES.hygiene.stages[stage] || 0.6) * minutes)
  const newEnergy = clamp(state.creature.energy - (DECAY_RATES.energy.stages[stage] || 0.3) * minutes)

  // Health damage if needs are critical
  let newHealth = state.creature.health
  if (newHunger < 20 || newHappiness < 20 || newHygiene < 20) {
    newHealth = clamp(newHealth - minutes * 0.5)
  }
  // Passive health regen if all needs are good
  if (newHunger > 70 && newHappiness > 70 && newHygiene > 70 && newEnergy > 50) {
    newHealth = clamp(newHealth + minutes * 0.2)
  }

  // Poop chance
  let newHasPoop = state.creature.hasPoop
  if (!newHasPoop && Math.random() < 0.003 * minutes * speed) {
    newHasPoop = true
  }

  // Age progression (in hours)
  const newAge = state.creature.age + (deltaSeconds * speed) / 3600

  // Stage evolution
  let newStage = stage
  let message = state.ui.message
  const stageOrder = ['baby', 'junior', 'teen', 'adult', 'champion', 'legendary']
  for (const s of stageOrder) {
    if (STAGES[s] && newAge >= STAGES[s].minAge && STAGE_ORDER.indexOf(s) > STAGE_ORDER.indexOf(stage)) {
      // Check if creature can evolve (needs reasonable care)
      if (newHealth > 30 && newHunger > 20) {
        newStage = s
        message = `🌟 ${state.creature.name} evolue en ${STAGES[s].name} !`
        break
      }
    }
  }

  // Determine element type when reaching teen stage (if not set)
  let newElement = state.creature.element
  if (newStage !== stage && (newStage === 'teen' || (!newElement && STAGE_ORDER.indexOf(newStage) >= STAGE_ORDER.indexOf('teen')))) {
    const affinities = state.creature.elementAffinity
    const dominantStat = Object.entries(state.creature.stats).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    const elementMap = { atk: 'fire', def: 'water', vit: 'earth', spd: 'wind', int: 'light', cha: 'shadow' }

    // Mix of affinity points and dominant stat
    const maxAffinity = Object.entries(affinities).reduce((a, b) => a[1] > b[1] ? a : b)
    if (maxAffinity[1] > 10) {
      newElement = maxAffinity[0]
    } else {
      newElement = elementMap[dominantStat] || 'fire'
    }

    // Learn element move
    const elementMoves = Object.values(MOVES).filter(m => m.element === newElement && !m.minLevel)
    if (elementMoves.length > 0 && !state.creature.moves.includes(elementMoves[0].id)) {
      // Will be handled in the state update below
    }
  }

  // Learn new moves on level up or evolution
  let newMoves = [...state.creature.moves]
  if (newElement) {
    const available = getAvailableMoves(newElement, state.creature.level, state.creature.stats)
    available.forEach(moveId => {
      if (!newMoves.includes(moveId) && newMoves.length < 4) {
        newMoves.push(moveId)
      }
    })
  }

  // Passive income from clicker
  let newCoins = state.economy.coins
  let newTotalCoins = state.economy.totalCoinsEarned
  if (state.economy.coinsPerSecond > 0) {
    const earned = state.economy.coinsPerSecond * deltaSeconds * speed
    newCoins += earned
    newTotalCoins += earned
  }

  // Golden click timeout
  let goldenActive = state.economy.goldenClickActive
  if (goldenActive && Date.now() > state.economy.goldenClickEnd) {
    goldenActive = false
  }

  // Play time tracking
  const newPlayTime = state.stats.totalPlayTime + deltaSeconds

  // Daily streak
  const today = new Date().toDateString()
  let newDailyStreak = state.stats.dailyStreak
  if (state.stats.lastLoginDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (state.stats.lastLoginDate === yesterday) {
      newDailyStreak++
    } else if (state.stats.lastLoginDate) {
      newDailyStreak = 1
    } else {
      newDailyStreak = 1
    }
  }

  return {
    ...state,
    creature: {
      ...state.creature,
      hunger: newHunger,
      happiness: newHappiness,
      hygiene: newHygiene,
      energy: newEnergy,
      health: newHealth,
      age: newAge,
      stage: newStage,
      element: newElement,
      hasPoop: newHasPoop,
      moves: newMoves,
    },
    economy: {
      ...state.economy,
      coins: newCoins,
      totalCoinsEarned: newTotalCoins,
      goldenClickActive: goldenActive,
    },
    stats: {
      ...state.stats,
      totalPlayTime: newPlayTime,
      dailyStreak: newDailyStreak,
      lastLoginDate: today,
    },
    ui: { ...state.ui, message },
    lastUpdate: Date.now(),
  }
}

// ============================================
// PROVIDER COMPONENT
// ============================================
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    // Try to load from localStorage
    try {
      const saved = localStorage.getItem('evoli-chronicles-save')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Merge with defaults in case of new fields
        const defaults = createInitialState()
        return {
          ...defaults,
          ...parsed,
          creature: { ...defaults.creature, ...parsed.creature },
          economy: { ...defaults.economy, ...parsed.economy },
          battle: { ...defaults.battle, ...parsed.battle, active: false },
          stats: { ...defaults.stats, ...parsed.stats },
          settings: { ...defaults.settings, ...parsed.settings },
          ui: defaults.ui,
          lastUpdate: Date.now(),
        }
      }
    } catch (e) {
      console.error('Failed to load save:', e)
    }
    return createInitialState()
  })

  // Auto-save every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const toSave = { ...state }
        delete toSave.ui // Don't save UI state
        localStorage.setItem('evoli-chronicles-save', JSON.stringify(toSave))
      } catch (e) {
        console.error('Failed to save:', e)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [state])

  // Game tick (1 second)
  const lastTickRef = useRef(Date.now())
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const delta = (now - lastTickRef.current) / 1000
      lastTickRef.current = now
      dispatch({ type: 'TICK', payload: { deltaSeconds: Math.min(delta, 5) } })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Animation tick (300ms)
  useEffect(() => {
    if (state.creature.stage === 'egg') return
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_ANIMATION' })
    }, 400)
    return () => clearInterval(interval)
  }, [state.creature.stage])

  // Golden click random spawn
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.economy.goldenClickActive) return
      const timeSince = (Date.now() - state.economy.lastGoldenClick) / 1000
      if (timeSince < GOLDEN_CLICK.minInterval) return

      const chance = GOLDEN_CLICK.baseChance + (state.economy.prestigeUpgrades?.p_golden || 0) * 0.05
      if (Math.random() < chance) {
        dispatch({ type: 'GOLDEN_CLICK_START' })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [state.economy.goldenClickActive, state.economy.lastGoldenClick, state.economy.prestigeUpgrades])

  // Achievement checking (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(ACHIEVEMENTS).forEach(([id, ach]) => {
        if (!state.achievements[id] && ach.check(state)) {
          dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: id })
        }
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [state])

  // Clear messages after 3 seconds
  useEffect(() => {
    if (state.ui.message) {
      const timer = setTimeout(() => dispatch({ type: 'CLEAR_MESSAGE' }), 3000)
      return () => clearTimeout(timer)
    }
  }, [state.ui.message])

  const value = { state, dispatch }
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within GameProvider')
  return context
}

export { getCareCost, calculateHP, calculateCPS }
