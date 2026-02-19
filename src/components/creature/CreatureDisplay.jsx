import React from 'react'
import { useGame } from '../../context/GameContext'
import { EVOLI_COLORS, EVOLI_PIXELS, STAGES, ELEMENTS, ELEMENT_TINTS } from '../../data/creatures'

export default function CreatureDisplay({ size = 'normal' }) {
  const { state, dispatch } = useGame()
  const { creature } = state

  if (creature.stage === 'egg') {
    return <EggDisplay eggClicks={creature.eggClicks} onClick={() => dispatch({ type: 'CLICK_EGG' })} />
  }

  const pixelSize = size === 'small' ? 2 : (STAGES[creature.stage]?.pixelSize || 4)
  const mood = getMood(creature)
  const elementTint = creature.element ? ELEMENT_TINTS[creature.element] : null

  // Build display data with mood/animation modifications
  let displayData = EVOLI_PIXELS.map(row => [...row])

  // Mood affects eyes
  if (mood === 'sad') {
    displayData[13][6] = 'c22'
    displayData[13][7] = 'c22'
    displayData[13][15] = 'c22'
    displayData[13][16] = 'c22'
  }

  // Ear animation
  if (creature.animationFrame === 1) {
    displayData[5][10] = 'c10'
    displayData[5][11] = 'c10'
  } else if (creature.animationFrame === 2) {
    displayData[5][10] = 'c7'
    displayData[5][11] = 'c7'
  } else if (creature.animationFrame === 3) {
    displayData[5][10] = 'c15'
    displayData[5][11] = 'c15'
  }

  // Mouth animation
  if (creature.animationFrame === 1) {
    displayData[20][10] = 'c22'
  } else if (creature.animationFrame === 2) {
    displayData[20][10] = 'c10'
  } else if (creature.animationFrame === 3) {
    displayData[20][10] = 'c12'
  }

  // Eye blink
  if (creature.animationFrame === 2) {
    displayData[13][6] = 'c1'
    displayData[13][7] = 'c1'
    displayData[13][15] = 'c1'
    displayData[13][16] = 'c1'
  }

  return (
    <div className="relative inline-block">
      {/* Element glow effect */}
      {elementTint && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30 -z-10"
          style={{
            background: `radial-gradient(circle, ${elementTint.glow}44, transparent 70%)`,
            transform: 'scale(2)',
          }}
        />
      )}

      <svg
        width={28 * pixelSize}
        height={29 * pixelSize}
        className="pixelated drop-shadow-lg"
        style={{ marginLeft: creature.position, transition: 'margin-left 0.3s ease' }}
      >
        {/* Element overlay filter */}
        {elementTint && (
          <defs>
            <filter id="elementTint">
              <feFlood floodColor={elementTint.overlay} result="tint" />
              <feBlend in="SourceGraphic" in2="tint" mode="overlay" />
            </filter>
          </defs>
        )}

        <g filter={elementTint ? 'url(#elementTint)' : undefined}>
          {displayData.map((row, y) =>
            row.map((colorKey, x) => {
              if (colorKey === 't') return null
              return (
                <rect
                  key={`${x}-${y}`}
                  x={x * pixelSize}
                  y={y * pixelSize}
                  width={pixelSize}
                  height={pixelSize}
                  fill={EVOLI_COLORS[colorKey]}
                />
              )
            })
          )}
        </g>

        {/* Evolution sparkles for champion/legendary */}
        {(creature.stage === 'champion' || creature.stage === 'legendary') && (
          <>
            <circle cx={5 * pixelSize} cy={3 * pixelSize} r={pixelSize * 0.5}
              fill={elementTint?.glow || '#eab308'} opacity={creature.animationFrame % 2 === 0 ? 0.8 : 0.3}>
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx={22 * pixelSize} cy={5 * pixelSize} r={pixelSize * 0.4}
              fill={elementTint?.glow || '#eab308'} opacity={creature.animationFrame % 2 === 1 ? 0.8 : 0.3}>
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={14 * pixelSize} cy={1 * pixelSize} r={pixelSize * 0.6}
              fill={elementTint?.glow || '#eab308'} opacity={0.5}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
              <animate attributeName="r" values={`${pixelSize * 0.4};${pixelSize * 0.7};${pixelSize * 0.4}`} dur="1s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>

      {/* Poop indicator */}
      {creature.hasPoop && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xl animate-bounce-slow">
          💩
        </div>
      )}

      {/* Stage badge */}
      {creature.element && (
        <div
          className="absolute -top-2 -right-2 text-lg"
          title={ELEMENTS[creature.element]?.name}
        >
          {ELEMENTS[creature.element]?.icon}
        </div>
      )}
    </div>
  )
}

function EggDisplay({ eggClicks, onClick }) {
  const crackIntensity = eggClicks / 10

  return (
    <div
      className="relative cursor-pointer hover:scale-105 transition-transform active:scale-95"
      onClick={onClick}
    >
      <svg width={120} height={140} viewBox="0 0 120 140">
        {/* Egg shadow */}
        <ellipse cx={60} cy={130} rx={35} ry={8} fill="rgba(0,0,0,0.2)" />

        {/* Egg body */}
        <ellipse cx={60} cy={65} rx={40} ry={55}
          fill="url(#eggGradient)" stroke="#d4d4d4" strokeWidth={2} />

        {/* Egg gradient */}
        <defs>
          <radialGradient id="eggGradient" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="50%" stopColor="#f5f0ff" />
            <stop offset="100%" stopColor="#e8e0f0" />
          </radialGradient>
        </defs>

        {/* Spots */}
        <circle cx={45} cy={50} r={6} fill="#d8c8f0" opacity={0.5} />
        <circle cx={70} cy={70} r={5} fill="#c8b8e8" opacity={0.4} />
        <circle cx={55} cy={85} r={4} fill="#d0c0f0" opacity={0.5} />

        {/* Cracks */}
        {eggClicks >= 1 && (
          <path d="M40,55 L50,50 L45,40 L55,45" stroke="#888" strokeWidth={1.5} fill="none" />
        )}
        {eggClicks >= 2 && (
          <path d="M65,60 L75,55 L70,45" stroke="#888" strokeWidth={1.5} fill="none" />
        )}
        {eggClicks >= 3 && (
          <path d="M50,75 L60,70 L55,62 L65,65" stroke="#888" strokeWidth={1.5} fill="none" />
        )}
        {eggClicks >= 5 && (
          <path d="M35,65 L45,60 L40,50" stroke="#777" strokeWidth={2} fill="none" />
        )}
        {eggClicks >= 7 && (
          <path d="M55,80 L65,75 L60,65 L70,70" stroke="#666" strokeWidth={2} fill="none" />
        )}
        {eggClicks >= 8 && (
          <path d="M30,70 L40,65 L35,55 L50,60 L45,48" stroke="#555" strokeWidth={2} fill="none" />
        )}

        {/* Glow when close to hatching */}
        {eggClicks >= 7 && (
          <ellipse cx={60} cy={65} rx={42} ry={57}
            fill="none" stroke="#a855f7" strokeWidth={2} opacity={0.5}>
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1s" repeatCount="indefinite" />
          </ellipse>
        )}
      </svg>

      {/* Click counter */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-purple-700">
        {eggClicks}/10 clics
      </div>
    </div>
  )
}

function getMood(creature) {
  const avg = (creature.hunger + creature.happiness + creature.health) / 3
  if (avg > 70) return 'happy'
  if (avg > 40) return 'neutral'
  return 'sad'
}
