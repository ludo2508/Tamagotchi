import React from 'react'
import { getStatColor } from '../../utils/formatters'

export function NeedBar({ icon, label, value, color }) {
  const barColor = color || getStatColor(value)
  const bgColor = barColor + '33'

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm w-5 text-center">{icon}</span>
      {label && <span className="text-xs text-white/60 w-12 truncate">{label}</span>}
      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: bgColor }}>
        <div
          className="h-full rounded-full transition-all duration-500 relative"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: barColor }}
        >
          {value > 70 && (
            <div className="absolute inset-0 stat-bar-shimmer rounded-full" />
          )}
        </div>
      </div>
      <span className="text-xs font-bold w-8 text-right number-display" style={{ color: barColor }}>
        {Math.round(value)}
      </span>
    </div>
  )
}

export function StatBar({ icon, label, value, maxValue = 999, color = '#a855f7' }) {
  const percent = (value / maxValue) * 100

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <span className="text-xs text-white/60 w-8">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold w-10 text-right number-display" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

export function HPBar({ current, max, color = '#22c55e', label }) {
  const percent = max > 0 ? (current / max) * 100 : 0
  const hpColor = percent > 50 ? '#22c55e' : percent > 25 ? '#eab308' : '#ef4444'

  return (
    <div>
      {label && <div className="text-xs text-white/60 mb-0.5">{label}</div>}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-3 rounded-full bg-black/30 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%`, backgroundColor: hpColor }}
          />
        </div>
        <span className="text-xs font-bold number-display" style={{ color: hpColor }}>
          {Math.max(0, Math.ceil(current))}/{max}
        </span>
      </div>
    </div>
  )
}
