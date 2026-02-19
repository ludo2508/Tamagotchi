import React from 'react'
import { useGame, calculateHP } from '../../context/GameContext'
import { HPBar } from '../ui/ProgressBar'
import { ELEMENTS, STAGES } from '../../data/creatures'
import { MOVES, TYPE_CHART } from '../../data/moves'
import { formatNumber } from '../../utils/formatters'

export default function BattlePanel() {
  const { state, dispatch } = useGame()
  const { creature, battle, economy } = state

  // Check if creature can battle
  const canBattle = creature.stage !== 'egg' && creature.stage !== 'baby'

  if (!canBattle) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-6xl mb-4">⚔️</div>
        <h2 className="text-xl font-bold text-white mb-2">Arene de Combat</h2>
        <p className="text-white/50 text-sm">
          Ta creature doit atteindre le stade Junior pour pouvoir combattre.
        </p>
        <div className="text-white/30 text-xs mt-2">
          Stade actuel: {STAGES[creature.stage]?.name}
        </div>
      </div>
    )
  }

  if (battle.active) {
    return <BattleView />
  }

  return <BattleLobby />
}

function BattleLobby() {
  const { state, dispatch } = useGame()
  const { creature, battle } = state

  const playerHP = calculateHP(creature)
  const rankColors = {
    Bronze: '#cd7f32',
    Argent: '#c0c0c0',
    Or: '#ffd700',
    Platine: '#e5e4e2',
    Diamant: '#b9f2ff',
    Maitre: '#ff6b6b',
    Legendaire: '#a855f7',
  }

  return (
    <div className="flex flex-col h-full p-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl p-4 mb-3 border border-red-500/20">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-bold text-white">⚔️ Arene</h2>
            <div className="text-xs text-white/50">
              Rang: <span style={{ color: rankColors[battle.rank] || '#cd7f32' }} className="font-bold">
                {battle.rank}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60">
              {battle.wins}V / {battle.losses}D
            </div>
            {battle.streak > 0 && (
              <div className="text-xs text-orange-400 font-bold">
                🔥 Serie de {battle.streak}
              </div>
            )}
          </div>
        </div>

        {/* Player creature info */}
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">
              {creature.name} {ELEMENTS[creature.element]?.icon || ''}
            </span>
            <span className="text-xs text-white/50">Niv. {creature.level}</span>
          </div>
          <HPBar current={playerHP} max={playerHP} label="PV" />
          <div className="flex gap-3 mt-2 text-[10px] text-white/40">
            <span>ATK {creature.stats.atk}</span>
            <span>DEF {creature.stats.def}</span>
            <span>SPD {creature.stats.spd}</span>
            <span>INT {creature.stats.int}</span>
          </div>
          <div className="flex gap-1 mt-2">
            {creature.moves.map(moveId => {
              const move = MOVES[moveId]
              if (!move) return null
              return (
                <span key={moveId} className="text-[10px] bg-white/10 rounded px-1.5 py-0.5">
                  {move.icon} {move.name}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Fight button */}
      <button
        onClick={() => dispatch({ type: 'START_BATTLE' })}
        disabled={state.creature.energy < 20}
        className={`w-full p-4 rounded-xl text-center font-bold text-lg transition-all mb-3 ${
          state.creature.energy < 20
            ? 'bg-white/5 text-white/30 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-500 hover:to-orange-500 active:scale-95 shadow-lg shadow-red-900/30'
        }`}
      >
        {state.creature.energy < 20
          ? '⚡ Pas assez d\'energie (20 requis)'
          : '⚔️ COMBATTRE !'
        }
      </button>
      <div className="text-[10px] text-white/30 text-center mb-3">
        Cout: 20 ⚡ | Recompense: pieces + EXP
      </div>

      {/* Battle history */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-xs text-white/40 mb-2">Statistiques</div>
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Victoires" value={battle.wins} icon="🏆" />
          <StatBox label="Defaites" value={battle.losses} icon="💀" />
          <StatBox label="Meilleure serie" value={battle.bestStreak} icon="🔥" />
          <StatBox label="Combats totaux" value={state.stats.totalBattles} icon="⚔️" />
        </div>

        {/* Type chart */}
        <div className="mt-3 text-xs text-white/40 mb-2">Table des types</div>
        <div className="bg-white/5 rounded-lg p-2 text-[10px]">
          {Object.entries(ELEMENTS).map(([el, data]) => (
            <div key={el} className="flex items-center gap-1 mb-0.5">
              <span className="w-5">{data.icon}</span>
              <span className="text-green-400 flex-1">
                Fort: {data.strong.map(s => ELEMENTS[s]?.icon).join(' ')}
              </span>
              <span className="text-red-400 flex-1">
                Faible: {data.weak.map(w => ELEMENTS[w]?.icon).join(' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BattleView() {
  const { state, dispatch } = useGame()
  const { creature, battle } = state

  return (
    <div className="flex flex-col h-full p-3">
      {/* Opponent info */}
      <div className="bg-red-900/20 rounded-xl p-3 mb-2 border border-red-500/20">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-red-300">
            {battle.opponent.name} {ELEMENTS[battle.opponent.element]?.icon || ''}
          </span>
          <span className="text-xs text-white/50">Niv. {battle.opponent.level}</span>
        </div>
        <HPBar current={battle.opponentHP} max={battle.opponentMaxHP} />
      </div>

      {/* VS indicator */}
      <div className="text-center text-xs text-white/30 my-1">
        {battle.turn === 'player' ? '👉 Ton tour' : '⏳ Tour adverse'}
      </div>

      {/* Player info */}
      <div className="bg-blue-900/20 rounded-xl p-3 mb-2 border border-blue-500/20">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-blue-300">
            {creature.name} {ELEMENTS[creature.element]?.icon || ''}
          </span>
          <span className="text-xs text-white/50">Niv. {creature.level}</span>
        </div>
        <HPBar current={battle.playerHP} max={battle.playerMaxHP} />
      </div>

      {/* Battle log */}
      <div className="flex-1 overflow-y-auto bg-white/5 rounded-xl p-2 mb-2 min-h-[80px]">
        {battle.log.slice(-6).map((msg, i) => (
          <div
            key={i}
            className={`text-xs py-0.5 ${i === battle.log.length - 1 ? 'text-white' : 'text-white/40'}`}
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Move buttons */}
      {battle.active ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            {creature.moves.map(moveId => {
              const move = MOVES[moveId]
              if (!move) return null

              const elementColor = move.element !== 'neutral'
                ? ELEMENTS[move.element]?.color + '33'
                : 'rgba(255,255,255,0.05)'

              return (
                <button
                  key={moveId}
                  onClick={() => dispatch({ type: 'BATTLE_MOVE', payload: moveId })}
                  disabled={battle.turn !== 'player'}
                  className={`p-2.5 rounded-xl text-left transition-all border ${
                    battle.turn !== 'player'
                      ? 'opacity-50 cursor-not-allowed border-white/5'
                      : 'hover:scale-[1.02] active:scale-95 border-white/10 hover:border-white/30'
                  }`}
                  style={{ backgroundColor: elementColor }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{move.icon}</span>
                    <div>
                      <div className="text-xs font-bold">{move.name}</div>
                      <div className="text-[10px] text-white/50">
                        {move.type === 'attack' ? `POW ${move.power}` : move.desc}
                        {' | '}{move.accuracy}%
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <button
            onClick={() => dispatch({ type: 'FLEE_BATTLE' })}
            className="w-full p-2 rounded-xl text-xs text-white/40 bg-white/5 hover:bg-white/10 transition-all"
          >
            🏃 Fuir le combat
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className={`text-2xl mb-2 ${battle.opponentHP <= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
            {battle.opponentHP <= 0 ? '🏆 VICTOIRE !' : '💀 DEFAITE'}
          </div>
          <button
            onClick={() => dispatch({ type: 'START_BATTLE' })}
            disabled={creature.energy < 20}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${
              creature.energy < 20
                ? 'bg-white/10 text-white/30'
                : 'bg-gradient-to-r from-red-600 to-orange-600 text-white active:scale-95'
            }`}
          >
            Prochain combat
          </button>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, icon }) {
  return (
    <div className="bg-white/5 rounded-lg p-2 text-center">
      <div className="text-xl">{icon}</div>
      <div className="text-lg font-bold text-white number-display">{value}</div>
      <div className="text-[10px] text-white/40">{label}</div>
    </div>
  )
}
