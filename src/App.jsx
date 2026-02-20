import React from 'react'
import { GameProvider, useGame } from './context/GameContext'
import HabitatPanel from './components/care/HabitatPanel'
import ClickerPanel from './components/clicker/ClickerPanel'
import BattlePanel from './components/battle/BattlePanel'
import ShopPanel from './components/shop/ShopPanel'
import AchievementsPanel from './components/achievements/AchievementsPanel'

function AppContent() {
  const { state, dispatch } = useGame()
  const { activeTab } = state.ui

  const tabs = [
    { id: 'habitat', icon: '🏠', label: 'Habitat' },
    { id: 'clicker', icon: '💰', label: 'Travail' },
    { id: 'battle', icon: '⚔️', label: 'Combat' },
    { id: 'shop', icon: '🛒', label: 'Boutique' },
    { id: 'achievements', icon: '🏆', label: 'Succes' },
  ]

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0f0520] via-[#150830] to-[#0a0318]">
      {/* Notification banner */}
      {state.ui.message && (
        <div className="absolute top-0 left-0 right-0 z-50 animate-slide-up">
          <div className="mx-3 mt-2 px-4 py-2 rounded-xl bg-purple-600/90 backdrop-blur-sm text-white text-sm font-medium text-center shadow-lg shadow-purple-900/50 border border-purple-400/30">
            {state.ui.message}
          </div>
        </div>
      )}

      {/* Achievement notifications */}
      <div className="fixed top-12 right-3 z-50 space-y-2">
        {state.ui.notifications.slice(0, 3).map((notif, i) => (
          <div
            key={notif.time}
            className="animate-slide-up bg-amber-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg cursor-pointer border border-amber-400/30"
            onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION', payload: i })}
          >
            {notif.text}
          </div>
        ))}
      </div>

      {/* Speed indicator */}
      {state.settings.timeSpeed > 1 && (
        <div className="absolute top-2 right-2 z-40">
          <button
            onClick={() => dispatch({ type: 'SET_TIME_SPEED', payload: 1 })}
            className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white animate-pulse"
          >
            ⏩ {state.settings.timeSpeed}x
          </button>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full tab-content" key={activeTab}>
          {activeTab === 'habitat' && <HabitatPanel />}
          {activeTab === 'clicker' && <ClickerPanel />}
          {activeTab === 'battle' && <BattlePanel />}
          {activeTab === 'shop' && <ShopPanel />}
          {activeTab === 'achievements' && <AchievementsPanel />}
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="flex-shrink-0 border-t border-white/10 bg-[#0f0520]/95 backdrop-blur-md">
        <div className="flex">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
                className={`flex-1 py-2 flex flex-col items-center gap-0.5 transition-all ${
                  isActive
                    ? 'text-purple-400'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                <span className={`text-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
                <span className={`text-[10px] font-medium ${isActive ? 'text-purple-300' : ''}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="w-6 h-0.5 rounded-full bg-purple-400 mt-0.5" />
                )}
              </button>
            )
          })}
        </div>

        {/* Dev speed control - only in dev */}
        {import.meta.env.DEV && (
          <div className="flex justify-center gap-1 pb-1">
            {[1, 10, 100].map(speed => (
              <button
                key={speed}
                onClick={() => dispatch({ type: 'SET_TIME_SPEED', payload: speed })}
                className={`text-[9px] px-1.5 py-0.5 rounded ${
                  state.settings.timeSpeed === speed
                    ? 'bg-orange-500/30 text-orange-300'
                    : 'text-white/20'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
