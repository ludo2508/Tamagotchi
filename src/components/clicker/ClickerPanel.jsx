import React, { useState, useRef, useCallback } from 'react'
import { useGame } from '../../context/GameContext'
import { CLICKER_UPGRADES, getUpgradeCost, CLICK_UPGRADES, PRESTIGE_UPGRADES, calculateStardust, COMBO_CONFIG } from '../../data/upgrades'
import { formatNumber } from '../../utils/formatters'

export default function ClickerPanel() {
  const { state, dispatch } = useGame()
  const { economy, settings } = state
  const [subTab, setSubTab] = useState('click') // click, upgrades, prestige
  const [clickEffects, setClickEffects] = useState([])
  const clickAreaRef = useRef(null)

  const handleClick = useCallback((e) => {
    dispatch({ type: 'CLICK' })

    // Visual feedback
    const rect = clickAreaRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const clickVal = getClickValue(economy, settings)
      const id = Date.now() + Math.random()
      setClickEffects(prev => [...prev.slice(-15), { x, y, value: clickVal, id }])
      setTimeout(() => setClickEffects(prev => prev.filter(e => e.id !== id)), 1000)
    }
  }, [dispatch, economy, settings])

  const nextClickUpgrade = CLICK_UPGRADES[economy.clickMultiplierLevel + 1]
  const currentClickMultiplier = CLICK_UPGRADES[economy.clickMultiplierLevel]?.multiplier || 1
  const potentialStardust = calculateStardust(economy.totalCoinsEarned) - economy.stardustEarned

  return (
    <div className="flex flex-col h-full">
      {/* Header - Coins display */}
      <div className="flex-shrink-0 px-4 pt-3">
        <div className={`text-center p-4 rounded-2xl ${economy.goldenClickActive ? 'golden-glow bg-yellow-900/40' : 'bg-white/5'}`}>
          <div className="text-3xl font-bold text-yellow-400 number-display">
            {formatNumber(Math.floor(economy.coins))}
          </div>
          <div className="text-xs text-yellow-400/60">pieces</div>
          {economy.coinsPerSecond > 0 && (
            <div className="text-xs text-green-400 mt-0.5 number-display">
              +{formatNumber(economy.coinsPerSecond * settings.timeSpeed)}/s
            </div>
          )}
          {economy.goldenClickActive && (
            <div className="text-xs text-yellow-300 font-bold mt-1 animate-pulse">
              🌟 GOLDEN CLICK x{7} ACTIF ! 🌟
            </div>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 px-3 py-2">
        {[
          { id: 'click', label: '👆 Cliquer' },
          { id: 'upgrades', label: '📈 Ameliorations' },
          { id: 'prestige', label: `💫 Prestige ${economy.prestigeLevel > 0 ? `(${economy.prestigeLevel})` : ''}` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
              subTab === tab.id
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {subTab === 'click' && (
          <div className="flex flex-col h-full animate-slide-up">
            {/* Combo indicator */}
            {economy.comboCount > 0 && (
              <div className="text-center mb-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, rgba(168,85,247,${0.2 + economy.comboCount * 0.05}), rgba(236,72,153,${0.2 + economy.comboCount * 0.05}))`,
                    color: `rgb(${200 + economy.comboCount * 5}, ${150 + economy.comboCount * 10}, 255)`,
                  }}
                >
                  COMBO x{economy.comboCount} ! +{Math.floor(economy.comboCount * COMBO_CONFIG.bonusPerLevel * 100)}%
                </span>
              </div>
            )}

            {/* Click area */}
            <div
              ref={clickAreaRef}
              onClick={handleClick}
              className={`relative flex-1 min-h-[200px] rounded-2xl cursor-pointer select-none
                transition-all active:scale-[0.98] overflow-hidden
                ${economy.goldenClickActive
                  ? 'bg-gradient-to-br from-yellow-600/30 to-amber-700/30 border-2 border-yellow-400/50'
                  : 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-400/40'
                }`}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)',
                }} />
              </div>

              {/* Central icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-2 hover:animate-bounce-slow">💰</div>
                  <div className="text-white/60 text-sm font-medium">
                    +{formatNumber(getClickValue(economy, settings))} par clic
                  </div>
                  <div className="text-white/30 text-xs mt-1">
                    Puissance: x{currentClickMultiplier}
                    {economy.prestigeLevel > 0 && ` | Prestige: x${economy.prestigeMultiplier.toFixed(1)}`}
                  </div>
                </div>
              </div>

              {/* Click effects */}
              {clickEffects.map(effect => (
                <div
                  key={effect.id}
                  className="absolute text-yellow-300 font-bold text-lg pointer-events-none animate-coin-fly"
                  style={{ left: effect.x - 15, top: effect.y - 10 }}
                >
                  +{formatNumber(effect.value)}
                </div>
              ))}
            </div>

            {/* Click upgrade button */}
            {nextClickUpgrade && (
              <button
                onClick={() => dispatch({ type: 'BUY_CLICK_UPGRADE' })}
                disabled={economy.coins < nextClickUpgrade.cost}
                className={`mt-2 w-full p-2.5 rounded-xl text-sm font-medium transition-all ${
                  economy.coins < nextClickUpgrade.cost
                    ? 'bg-white/5 text-white/30'
                    : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white hover:bg-purple-500/30'
                }`}
              >
                {nextClickUpgrade.icon} {nextClickUpgrade.name} ({nextClickUpgrade.desc}) - {formatNumber(nextClickUpgrade.cost)} 💰
              </button>
            )}

            {/* Stats */}
            <div className="mt-2 flex justify-between text-[10px] text-white/30">
              <span>Clics: {formatNumber(economy.totalClicks)}</span>
              <span>Meilleur combo: {economy.bestCombo}</span>
              <span>Total gagne: {formatNumber(economy.totalCoinsEarned)}</span>
            </div>
          </div>
        )}

        {subTab === 'upgrades' && (
          <div className="space-y-1.5 animate-slide-up">
            {CLICKER_UPGRADES.map((upgrade, index) => {
              const owned = economy.upgrades[upgrade.id] || 0
              const cost = getUpgradeCost(upgrade, owned)
              const production = upgrade.baseProduction * owned * economy.prestigeMultiplier *
                (1 + (economy.prestigeUpgrades?.p_production || 0) * 0.10)
              const canAfford = economy.coins >= cost

              return (
                <button
                  key={upgrade.id}
                  onClick={() => dispatch({ type: 'BUY_UPGRADE', payload: { upgradeIndex: index } })}
                  disabled={!canAfford}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-2 ${
                    canAfford
                      ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/30'
                      : 'bg-white/[0.02] text-white/30 border border-white/5'
                  }`}
                >
                  <span className="text-2xl w-8 text-center">{upgrade.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium truncate">{upgrade.name}</span>
                      <span className={`text-xs font-bold ml-2 ${canAfford ? 'text-yellow-400' : 'text-white/30'}`}>
                        {formatNumber(cost)} 💰
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/40 truncate">
                        +{formatNumber(upgrade.baseProduction)}/s chacun
                        {owned > 0 && ` | Total: ${formatNumber(production)}/s`}
                      </span>
                      <span className="text-[10px] text-purple-400 font-bold ml-2">x{owned}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {subTab === 'prestige' && (
          <div className="animate-slide-up">
            {/* Prestige info */}
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-4 mb-3 border border-purple-500/20">
              <div className="text-center mb-3">
                <div className="text-2xl mb-1">💫</div>
                <div className="text-lg font-bold text-purple-300">Prestige Niv.{economy.prestigeLevel}</div>
                <div className="text-xs text-white/50 mt-1">
                  Multiplicateur global: x{economy.prestigeMultiplier.toFixed(1)}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-white/60">Poussiere d'Etoile</span>
                  <span className="text-lg font-bold text-purple-300">{economy.stardust} 💫</span>
                </div>
                {potentialStardust > 0 && (
                  <div className="text-xs text-green-400">
                    +{potentialStardust} disponible au prochain prestige
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (potentialStardust > 0 && window.confirm(
                    `Prestige reset ! Tu gagneras ${potentialStardust} poussiere d'etoile.\nTon argent et tes upgrades de clicker seront reinitialises.\nTa creature, ton inventaire et tes succes sont conserves.`
                  )) {
                    dispatch({ type: 'PRESTIGE' })
                  }
                }}
                disabled={potentialStardust <= 0}
                className={`w-full p-3 rounded-xl text-center font-bold transition-all ${
                  potentialStardust > 0
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 active:scale-95'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                {potentialStardust > 0
                  ? `🌟 PRESTIGE (+${potentialStardust} 💫)`
                  : 'Gagne plus de pieces pour prestigier'
                }
              </button>
              <div className="text-[10px] text-white/30 text-center mt-1">
                Besoin de {formatNumber(1000000)} pieces totales pour 1 💫
              </div>
            </div>

            {/* Prestige upgrades */}
            <div className="text-xs text-white/40 mb-2">Ameliorations de Prestige</div>
            <div className="space-y-1.5">
              {PRESTIGE_UPGRADES.map(upgrade => {
                const level = economy.prestigeUpgrades?.[upgrade.id] || 0
                const maxed = level >= upgrade.maxLevel
                const canAfford = economy.stardust >= upgrade.cost && !maxed

                return (
                  <button
                    key={upgrade.id}
                    onClick={() => dispatch({ type: 'BUY_PRESTIGE_UPGRADE', payload: upgrade.id })}
                    disabled={!canAfford}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-2 ${
                      maxed
                        ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                        : canAfford
                          ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                          : 'bg-white/[0.02] text-white/30 border border-white/5'
                    }`}
                  >
                    <span className="text-xl">{upgrade.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{upgrade.name}</span>
                        <span className="text-xs">
                          {maxed ? (
                            <span className="text-purple-400">MAX</span>
                          ) : (
                            <span className={canAfford ? 'text-purple-300' : 'text-white/30'}>
                              {upgrade.cost} 💫
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="text-[10px] text-white/40">
                        {upgrade.desc} | Niv. {level}/{upgrade.maxLevel}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getClickValue(economy, settings) {
  const base = economy.clickPower
  const multiplier = CLICK_UPGRADES[economy.clickMultiplierLevel]?.multiplier || 1
  const prestigeBonus = 1 + (economy.prestigeUpgrades?.p_click || 0) * 0.25
  const goldenBonus = economy.goldenClickActive ? 7 : 1
  return Math.floor(base * multiplier * prestigeBonus * goldenBonus * settings.timeSpeed)
}
