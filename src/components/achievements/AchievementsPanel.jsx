import React, { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES } from '../../data/achievements'
import { STAGES, ELEMENTS, TRAITS } from '../../data/creatures'
import { formatNumber, formatDuration, formatAge } from '../../utils/formatters'

export default function AchievementsPanel() {
  const { state } = useGame()
  const [subTab, setSubTab] = useState('achievements') // achievements, profile
  const [category, setCategory] = useState('all')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3">
        <h2 className="text-lg font-bold mb-2">🏆 Succes & Profil</h2>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 px-3 mb-2">
        {[
          { id: 'achievements', label: '🏆 Succes' },
          { id: 'profile', label: '📊 Profil' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
              subTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {subTab === 'achievements' ? (
          <AchievementsList category={category} setCategory={setCategory} />
        ) : (
          <ProfileView />
        )}
      </div>
    </div>
  )
}

function AchievementsList({ category, setCategory }) {
  const { state } = useGame()
  const allAchs = Object.values(ACHIEVEMENTS)
  const unlocked = Object.keys(state.achievements).length
  const total = allAchs.length

  const categories = ['all', ...Object.keys(ACHIEVEMENT_CATEGORIES)]
  const filtered = category === 'all'
    ? allAchs
    : allAchs.filter(a => a.category === category)

  return (
    <div className="animate-slide-up">
      {/* Progress */}
      <div className="bg-white/5 rounded-xl p-3 mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-white/60">Progression</span>
          <span className="text-sm font-bold text-amber-400">{unlocked}/{total}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all"
            style={{ width: `${(unlocked / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-[10px] py-1 px-2 rounded-lg whitespace-nowrap ${
              category === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-white/40'
            }`}
          >
            {cat === 'all' ? '🌟 Tout' : `${ACHIEVEMENT_CATEGORIES[cat]?.icon} ${ACHIEVEMENT_CATEGORIES[cat]?.name}`}
          </button>
        ))}
      </div>

      {/* Achievement list */}
      <div className="space-y-1.5">
        {filtered.map(ach => {
          const isUnlocked = !!state.achievements[ach.id]
          return (
            <div
              key={ach.id}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                isUnlocked
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-white/[0.02] border-white/5 opacity-60'
              }`}
            >
              <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                {ach.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${isUnlocked ? 'text-amber-300' : 'text-white/50'}`}>
                    {ach.name}
                  </span>
                  {isUnlocked && <span className="text-[10px] text-green-400">✓</span>}
                </div>
                <div className="text-[10px] text-white/40">{ach.desc}</div>
                {ach.reward && (
                  <div className="text-[10px] text-yellow-400/60 mt-0.5">
                    Recompense: {ach.reward.coins ? `${formatNumber(ach.reward.coins)} 💰` : ''}
                    {ach.reward.stardust ? `${ach.reward.stardust} 💫` : ''}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProfileView() {
  const { state, dispatch } = useGame()
  const { creature, economy, battle, stats } = state

  return (
    <div className="animate-slide-up space-y-3">
      {/* Creature summary */}
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{STAGES[creature.stage]?.icon || '🥚'}</div>
          <div>
            <div className="text-lg font-bold">{creature.name}</div>
            <div className="text-xs text-white/50">
              {STAGES[creature.stage]?.name} | Niv. {creature.level}
              {creature.element && ` | ${ELEMENTS[creature.element]?.icon} ${ELEMENTS[creature.element]?.name}`}
            </div>
            <div className="text-xs text-white/40">Age: {formatAge(creature.age)}</div>
          </div>
        </div>

        {/* Traits */}
        {creature.traits.length > 0 && (
          <div className="mt-2 flex gap-2">
            {creature.traits.map(traitId => {
              const trait = TRAITS[traitId]
              return trait ? (
                <div key={traitId} className="bg-white/5 rounded-lg px-2 py-1">
                  <div className="text-[10px]">{trait.icon} {trait.name}</div>
                  <div className="text-[9px] text-white/40">{trait.desc}</div>
                </div>
              ) : null
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white/5 rounded-xl p-3">
        <div className="text-xs text-white/40 mb-2">Statistiques de jeu</div>
        <div className="space-y-1.5">
          <StatRow label="Temps de jeu" value={formatDuration(stats.totalPlayTime)} />
          <StatRow label="Jours consecutifs" value={`${stats.dailyStreak} jours`} />
          <StatRow label="Nourrissages" value={formatNumber(stats.totalFeedings)} />
          <StatRow label="Nettoyages" value={formatNumber(stats.totalCleans)} />
          <StatRow label="Soins" value={formatNumber(stats.totalHeals)} />
          <StatRow label="Entrainements" value={formatNumber(stats.totalTrainings)} />
          <StatRow label="Parties jouees" value={formatNumber(stats.totalPlays)} />
        </div>
      </div>

      {/* Economy */}
      <div className="bg-white/5 rounded-xl p-3">
        <div className="text-xs text-white/40 mb-2">Economie</div>
        <div className="space-y-1.5">
          <StatRow label="Pieces actuelles" value={formatNumber(Math.floor(economy.coins))} />
          <StatRow label="Total gagne" value={formatNumber(Math.floor(economy.totalCoinsEarned))} />
          <StatRow label="Clics totaux" value={formatNumber(economy.totalClicks)} />
          <StatRow label="Meilleur combo" value={economy.bestCombo.toString()} />
          <StatRow label="Production/s" value={`${formatNumber(economy.coinsPerSecond)}/s`} />
          <StatRow label="Niveau Prestige" value={economy.prestigeLevel.toString()} />
          <StatRow label="Poussiere d'etoile" value={economy.stardust.toString()} />
        </div>
      </div>

      {/* Battle */}
      <div className="bg-white/5 rounded-xl p-3">
        <div className="text-xs text-white/40 mb-2">Combat</div>
        <div className="space-y-1.5">
          <StatRow label="Rang" value={battle.rank} />
          <StatRow label="Victoires" value={battle.wins.toString()} />
          <StatRow label="Defaites" value={battle.losses.toString()} />
          <StatRow label="Serie actuelle" value={battle.streak.toString()} />
          <StatRow label="Meilleure serie" value={battle.bestStreak.toString()} />
          <StatRow label="Combats totaux" value={formatNumber(stats.totalBattles)} />
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-900/10 rounded-xl p-3 border border-red-500/20">
        <div className="text-xs text-red-400/60 mb-2">Zone dangereuse</div>
        <button
          onClick={() => {
            if (window.confirm('Vraiment tout recommencer ? Cette action est irreversible !')) {
              if (window.confirm('Derniere chance... Tu es sur ?')) {
                localStorage.removeItem('evoli-chronicles-save')
                dispatch({ type: 'RESET_GAME' })
              }
            }
          }}
          className="w-full p-2 rounded-lg text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
        >
          🗑️ Recommencer a zero
        </button>
      </div>
    </div>
  )
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-white/50">{label}</span>
      <span className="text-xs font-medium text-white/80 number-display">{value}</span>
    </div>
  )
}
