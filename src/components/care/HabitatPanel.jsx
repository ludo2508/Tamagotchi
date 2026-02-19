import React, { useState } from 'react'
import { useGame, getCareCost } from '../../context/GameContext'
import CreatureDisplay from '../creature/CreatureDisplay'
import { NeedBar, StatBar } from '../ui/ProgressBar'
import { STAGES, ELEMENTS, TRAITS, MAX_STATS } from '../../data/creatures'
import { FOOD_ITEMS, CARE_ITEMS, EQUIPMENT } from '../../data/items'
import { MOVES } from '../../data/moves'
import { formatAge, formatNumber } from '../../utils/formatters'

export default function HabitatPanel() {
  const { state, dispatch } = useGame()
  const { creature, economy } = state
  const [subTab, setSubTab] = useState('care') // care, feed, train, info

  return (
    <div className="flex flex-col h-full">
      {/* Creature Display Area */}
      <div className="flex-shrink-0 relative">
        <div className="bg-gradient-to-b from-indigo-900/50 to-purple-900/30 rounded-2xl p-4 mx-2 mt-2">
          {/* Creature name and info */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-bold text-white">{creature.name}</h2>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span>{STAGES[creature.stage]?.icon} {STAGES[creature.stage]?.name}</span>
                {creature.element && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px]"
                    style={{ backgroundColor: ELEMENTS[creature.element]?.color + '33', color: ELEMENTS[creature.element]?.color }}>
                    {ELEMENTS[creature.element]?.icon} {ELEMENTS[creature.element]?.name}
                  </span>
                )}
                <span>Niv.{creature.level}</span>
              </div>
            </div>
            <div className="text-right text-xs text-white/50">
              <div>Age: {formatAge(creature.age)}</div>
              <div className="text-yellow-400 font-bold">{formatNumber(Math.floor(economy.coins))} 💰</div>
            </div>
          </div>

          {/* Creature visual */}
          <div className="flex justify-center py-4">
            <CreatureDisplay />
          </div>

          {/* Traits */}
          {creature.traits.length > 0 && (
            <div className="flex justify-center gap-2 mt-1">
              {creature.traits.map(traitId => {
                const trait = TRAITS[traitId]
                return trait ? (
                  <span key={traitId} className="text-[10px] bg-white/10 rounded-full px-2 py-0.5">
                    {trait.icon} {trait.name}
                  </span>
                ) : null
              })}
            </div>
          )}
        </div>
      </div>

      {/* Needs bars */}
      <div className="px-4 py-2 space-y-1.5">
        <NeedBar icon="🍖" value={creature.hunger} />
        <NeedBar icon="😊" value={creature.happiness} />
        <NeedBar icon="❤️" value={creature.health} />
        <NeedBar icon="🧼" value={creature.hygiene} />
        <NeedBar icon="⚡" value={creature.energy} />
      </div>

      {/* Sub-tab navigation */}
      <div className="flex gap-1 px-3 py-1">
        {[
          { id: 'care', label: '🤲 Soins' },
          { id: 'feed', label: '🍽️ Nourrir' },
          { id: 'train', label: '💪 Entrainer' },
          { id: 'info', label: '📊 Stats' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
              subTab === tab.id
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {subTab === 'care' && <CareActions />}
        {subTab === 'feed' && <FeedPanel />}
        {subTab === 'train' && <TrainPanel />}
        {subTab === 'info' && <InfoPanel />}
      </div>
    </div>
  )
}

function CareActions() {
  const { state, dispatch } = useGame()
  const { creature, economy } = state

  const actions = [
    {
      icon: '🧼', label: 'Laver', cost: getCareCost(creature.stage, 'clean'),
      onClick: () => dispatch({ type: 'CLEAN' }),
      disabled: economy.coins < getCareCost(creature.stage, 'clean'),
    },
    {
      icon: '💊', label: 'Soigner', cost: getCareCost(creature.stage, 'heal'),
      onClick: () => dispatch({ type: 'HEAL' }),
      disabled: economy.coins < getCareCost(creature.stage, 'heal'),
    },
    {
      icon: '🎮', label: 'Jouer', cost: getCareCost(creature.stage, 'play'),
      onClick: () => dispatch({ type: 'PLAY' }),
      disabled: economy.coins < getCareCost(creature.stage, 'play') || creature.energy < 10,
    },
    {
      icon: '💤', label: 'Dormir', cost: 0,
      onClick: () => dispatch({ type: 'REST' }),
      disabled: creature.energy > 80,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 animate-slide-up">
      {actions.map(action => (
        <button
          key={action.label}
          onClick={action.onClick}
          disabled={action.disabled || creature.stage === 'egg'}
          className={`p-3 rounded-xl text-center transition-all active:scale-95 ${
            action.disabled
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 hover:border-purple-400/50 text-white hover:bg-purple-500/30'
          }`}
        >
          <div className="text-2xl mb-1">{action.icon}</div>
          <div className="text-xs font-medium">{action.label}</div>
          {action.cost > 0 && (
            <div className="text-[10px] text-yellow-400/80 mt-0.5">{action.cost} 💰</div>
          )}
        </button>
      ))}

      {/* Quick care items */}
      <div className="col-span-2 mt-2">
        <div className="text-xs text-white/40 mb-1.5">Objets rapides</div>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(CARE_ITEMS).map(item => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'USE_CARE_ITEM', payload: item.id })}
              disabled={economy.coins < item.price}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all ${
                economy.coins < item.price
                  ? 'bg-white/5 text-white/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={item.desc}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
              <span className="text-yellow-400">{item.price}💰</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeedPanel() {
  const { state, dispatch } = useGame()
  const { economy } = state
  const [category, setCategory] = useState('basic')

  const categories = ['basic', 'premium', 'elemental', 'legendary']
  const categoryLabels = { basic: 'Basique', premium: 'Premium', elemental: 'Elementaire', legendary: 'Legendaire' }

  const foods = Object.values(FOOD_ITEMS).filter(f => f.category === category)

  return (
    <div className="animate-slide-up">
      {/* Category tabs */}
      <div className="flex gap-1 mb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-1 text-[10px] py-1 rounded-lg ${
              category === cat
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Food items */}
      <div className="space-y-1.5">
        {foods.map(food => (
          <button
            key={food.id}
            onClick={() => dispatch({ type: 'FEED', payload: food.id })}
            disabled={economy.coins < food.price}
            className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2 ${
              economy.coins < food.price
                ? 'bg-white/5 text-white/30'
                : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-400/40 text-white'
            }`}
          >
            <span className="text-xl">{food.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{food.name}</span>
                <span className="text-xs text-yellow-400 font-bold">{food.price} 💰</span>
              </div>
              <div className="text-[10px] text-white/50">{food.desc}</div>
              <div className="flex gap-2 mt-0.5">
                {food.effects.hunger && <span className="text-[10px] text-green-400">🍖+{food.effects.hunger}</span>}
                {food.effects.happiness && <span className="text-[10px] text-pink-400">😊+{food.effects.happiness}</span>}
                {food.effects.health && <span className="text-[10px] text-red-400">❤️+{food.effects.health}</span>}
                {food.effects.energy && <span className="text-[10px] text-yellow-400">⚡+{food.effects.energy}</span>}
                {food.statBonus && Object.entries(food.statBonus).map(([stat, val]) => (
                  <span key={stat} className="text-[10px] text-purple-400">{stat.toUpperCase()}+{val}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function TrainPanel() {
  const { state, dispatch } = useGame()
  const { creature, economy } = state

  if (creature.stage === 'egg' || creature.stage === 'baby') {
    return (
      <div className="text-center text-white/40 py-8 animate-slide-up">
        <div className="text-4xl mb-2">🍼</div>
        <div className="text-sm">Trop jeune pour s'entrainer</div>
        <div className="text-xs mt-1">Disponible au stade Junior</div>
      </div>
    )
  }

  const trainCost = getCareCost(creature.stage, 'play') * 2
  const maxStat = MAX_STATS[creature.stage] || 50

  const stats = [
    { id: 'vit', icon: '❤️', label: 'VIT', color: '#22c55e', desc: 'Points de vie en combat' },
    { id: 'atk', icon: '⚔️', label: 'ATK', color: '#ef4444', desc: 'Degats physiques' },
    { id: 'def', icon: '🛡️', label: 'DEF', color: '#3b82f6', desc: 'Resistance aux degats' },
    { id: 'spd', icon: '💨', label: 'SPD', color: '#22d3ee', desc: 'Vitesse et esquive' },
    { id: 'int', icon: '🧠', label: 'INT', color: '#eab308', desc: 'Degats speciaux' },
    { id: 'cha', icon: '✨', label: 'CHA', color: '#a855f7', desc: 'Charme et influence' },
  ]

  return (
    <div className="space-y-2 animate-slide-up">
      <div className="text-xs text-white/40 text-center mb-1">
        Max: {maxStat} | Cout: {trainCost} 💰 | Energie: -15 ⚡
      </div>

      {stats.map(s => (
        <div key={s.id} className="flex items-center gap-2">
          <div className="flex-1">
            <StatBar icon={s.icon} label={s.label} value={creature.stats[s.id]} maxValue={maxStat} color={s.color} />
          </div>
          <button
            onClick={() => dispatch({ type: 'TRAIN', payload: { stat: s.id, cost: trainCost } })}
            disabled={economy.coins < trainCost || creature.energy < 10 || creature.stats[s.id] >= maxStat}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
              economy.coins < trainCost || creature.energy < 10 || creature.stats[s.id] >= maxStat
                ? 'bg-white/5 text-white/20'
                : 'bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 active:scale-95'
            }`}
          >
            +
          </button>
        </div>
      ))}
    </div>
  )
}

function InfoPanel() {
  const { state } = useGame()
  const { creature } = state

  const totalStats = Object.values(creature.stats).reduce((a, b) => a + b, 0)

  // Element affinity display
  const affinities = Object.entries(creature.elementAffinity)
    .filter(([_, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Level & EXP */}
      <div className="bg-white/5 rounded-xl p-3">
        <div className="text-xs text-white/60 mb-1">Niveau {creature.level}</div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            style={{ width: `${(creature.exp / (10 + creature.level * 5)) * 100}%` }}
          />
        </div>
        <div className="text-[10px] text-white/40 mt-0.5 text-right">
          {creature.exp} / {10 + creature.level * 5} EXP
        </div>
      </div>

      {/* Stats summary */}
      <div className="bg-white/5 rounded-xl p-3">
        <div className="flex justify-between text-xs text-white/60 mb-2">
          <span>Stats totales</span>
          <span className="text-purple-400 font-bold">{totalStats}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {Object.entries(creature.stats).map(([stat, val]) => (
            <div key={stat} className="bg-white/5 rounded-lg p-1.5">
              <div className="text-lg font-bold text-white">{val}</div>
              <div className="text-[10px] text-white/40 uppercase">{stat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Element affinity */}
      {affinities.length > 0 && (
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-xs text-white/60 mb-2">Affinite elementaire</div>
          {affinities.map(([element, value]) => (
            <div key={element} className="flex items-center gap-2 mb-1">
              <span className="text-sm">{ELEMENTS[element]?.icon}</span>
              <span className="text-xs text-white/60 w-14">{ELEMENTS[element]?.name}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, value * 2)}%`,
                    backgroundColor: ELEMENTS[element]?.color
                  }}
                />
              </div>
              <span className="text-[10px] text-white/40 w-6 text-right">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Moves */}
      <div className="bg-white/5 rounded-xl p-3">
        <div className="text-xs text-white/60 mb-2">Competences ({creature.moves.length}/4)</div>
        <div className="space-y-1">
          {creature.moves.map(moveId => {
            const move = MOVES[moveId]
            if (!move) return null
            return (
              <div key={moveId} className="flex items-center gap-2 bg-white/5 rounded-lg p-1.5">
                <span className="text-sm">{move.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-medium">{move.name}</div>
                  <div className="text-[10px] text-white/40">
                    {move.type === 'attack' ? `POW ${move.power}` : move.desc}
                    {move.element !== 'neutral' && ` | ${ELEMENTS[move.element]?.icon || ''}`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Equipment */}
      <div className="bg-white/5 rounded-xl p-3">
        <div className="text-xs text-white/60 mb-2">Equipement</div>
        {['weapon', 'armor', 'accessory'].map(slot => {
          const eqId = creature.equipment[slot]
          const eq = eqId ? EQUIPMENT[eqId] : null
          return (
            <div key={slot} className="flex items-center gap-2 bg-white/5 rounded-lg p-1.5 mb-1">
              <span className="text-sm">{eq ? eq.icon : '⬜'}</span>
              <div className="flex-1">
                <div className="text-[10px] text-white/40 capitalize">{slot}</div>
                <div className="text-xs">{eq ? eq.name : 'Vide'}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
