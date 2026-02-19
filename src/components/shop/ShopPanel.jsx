import React, { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { FOOD_ITEMS, EQUIPMENT, STAGE_ORDER, isStageUnlocked } from '../../data/items'
import { ELEMENTS, STAGES } from '../../data/creatures'
import { formatNumber } from '../../utils/formatters'

export default function ShopPanel() {
  const { state, dispatch } = useGame()
  const { economy, creature, inventory } = state
  const [category, setCategory] = useState('equipment') // equipment, food, inventory

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">🛒 Boutique</h2>
          <span className="text-yellow-400 font-bold">{formatNumber(Math.floor(economy.coins))} 💰</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 px-3 mb-2">
        {[
          { id: 'equipment', label: '⚔️ Equipement' },
          { id: 'food', label: '🍽️ Nourriture' },
          { id: 'inventory', label: '🎒 Inventaire' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCategory(tab.id)}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
              category === tab.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {category === 'equipment' && <EquipmentShop />}
        {category === 'food' && <FoodShop />}
        {category === 'inventory' && <InventoryView />}
      </div>
    </div>
  )
}

function EquipmentShop() {
  const { state, dispatch } = useGame()
  const { economy, creature } = state
  const [slot, setSlot] = useState('weapon')

  const items = Object.values(EQUIPMENT).filter(e => e.slot === slot)

  return (
    <div className="animate-slide-up">
      {/* Slot filter */}
      <div className="flex gap-1 mb-2">
        {[
          { id: 'weapon', label: '⚔️ Armes' },
          { id: 'armor', label: '🛡️ Armures' },
          { id: 'accessory', label: '💍 Accessoires' },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setSlot(s.id)}
            className={`flex-1 text-[10px] py-1 rounded-lg ${
              slot === s.id
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-white/40'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        {items.map(item => {
          const locked = !isStageUnlocked(creature.stage, item.minStage)
          const canAfford = economy.coins >= item.price
          const owned = state.inventory[item.id] || 0

          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border transition-all ${
                locked
                  ? 'bg-white/[0.02] border-white/5 opacity-50'
                  : canAfford
                    ? 'bg-white/5 border-white/10 hover:border-emerald-500/30'
                    : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.name}</span>
                    {owned > 0 && <span className="text-[10px] text-emerald-400">x{owned}</span>}
                  </div>
                  <div className="text-[10px] text-white/40 mb-1">{item.desc}</div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {Object.entries(item.stats).map(([stat, val]) => (
                      <span key={stat} className="text-[10px] bg-white/5 rounded px-1 py-0.5 text-green-400">
                        {stat.toUpperCase()} +{val}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-[10px] text-white/30">
                      {locked ? `🔒 Req: ${STAGES[item.minStage]?.name}` : ''}
                    </div>
                    {!locked && (
                      <button
                        onClick={() => dispatch({ type: 'BUY_EQUIPMENT', payload: item.id })}
                        disabled={!canAfford}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          canAfford
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 active:scale-95'
                            : 'bg-white/5 text-white/30'
                        }`}
                      >
                        {formatNumber(item.price)} 💰
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FoodShop() {
  const { state, dispatch } = useGame()
  const { economy } = state
  const [filter, setFilter] = useState('all')

  const categories = ['all', 'basic', 'premium', 'elemental', 'legendary']
  const catLabels = { all: 'Tout', basic: 'Basique', premium: 'Premium', elemental: 'Element', legendary: 'Legendaire' }

  const foods = Object.values(FOOD_ITEMS).filter(f => filter === 'all' || f.category === filter)

  return (
    <div className="animate-slide-up">
      <div className="flex gap-1 mb-2 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-[10px] py-1 px-2 rounded-lg whitespace-nowrap ${
              filter === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-white/40'
            }`}
          >
            {catLabels[cat]}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        {foods.map(food => {
          const canAfford = economy.coins >= food.price
          return (
            <button
              key={food.id}
              onClick={() => dispatch({ type: 'FEED', payload: food.id })}
              disabled={!canAfford}
              className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2 ${
                canAfford
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                  : 'bg-white/[0.02] text-white/30 border border-white/5'
              }`}
            >
              <span className="text-xl">{food.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span className="text-xs font-medium">{food.name}</span>
                  <span className={`text-xs font-bold ${canAfford ? 'text-yellow-400' : 'text-white/30'}`}>
                    {food.price} 💰
                  </span>
                </div>
                <div className="flex gap-1.5 mt-0.5 flex-wrap">
                  {food.effects.hunger > 0 && <span className="text-[9px] text-green-400">🍖+{food.effects.hunger}</span>}
                  {food.effects.happiness > 0 && <span className="text-[9px] text-pink-400">😊+{food.effects.happiness}</span>}
                  {food.effects.health > 0 && <span className="text-[9px] text-red-400">❤️+{food.effects.health}</span>}
                  {food.effects.energy > 0 && <span className="text-[9px] text-yellow-300">⚡+{food.effects.energy}</span>}
                  {food.statBonus && Object.entries(food.statBonus).map(([stat, val]) => (
                    <span key={stat} className="text-[9px] text-purple-400">{stat.toUpperCase()}+{val}</span>
                  ))}
                  {food.elementBonus && (
                    <span className="text-[9px]" style={{ color: ELEMENTS[food.elementBonus]?.color }}>
                      {ELEMENTS[food.elementBonus]?.icon}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function InventoryView() {
  const { state, dispatch } = useGame()
  const { creature, inventory } = state

  const items = Object.entries(inventory).filter(([_, count]) => count > 0)

  // Current equipment
  const equippedItems = Object.entries(creature.equipment)
    .filter(([_, id]) => id)
    .map(([slot, id]) => ({ slot, item: EQUIPMENT[id] }))

  return (
    <div className="animate-slide-up">
      {/* Equipped */}
      <div className="text-xs text-white/40 mb-2">Equipe</div>
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        {['weapon', 'armor', 'accessory'].map(slot => {
          const eqId = creature.equipment[slot]
          const eq = eqId ? EQUIPMENT[eqId] : null
          const slotLabels = { weapon: 'Arme', armor: 'Armure', accessory: 'Accessoire' }

          return (
            <div key={slot} className="bg-white/5 rounded-xl p-2 text-center border border-white/10">
              <div className="text-2xl mb-1">{eq ? eq.icon : '⬜'}</div>
              <div className="text-[10px] text-white/40">{slotLabels[slot]}</div>
              <div className="text-[10px] font-medium truncate">{eq ? eq.name : 'Vide'}</div>
            </div>
          )
        })}
      </div>

      {/* Inventory items */}
      <div className="text-xs text-white/40 mb-2">Inventaire ({items.length})</div>
      {items.length === 0 ? (
        <div className="text-center text-white/30 py-4 text-sm">
          Inventaire vide
        </div>
      ) : (
        <div className="space-y-1.5">
          {items.map(([itemId, count]) => {
            const eq = EQUIPMENT[itemId]
            if (!eq) return null

            return (
              <div key={itemId} className="flex items-center gap-2 bg-white/5 rounded-xl p-2 border border-white/10">
                <span className="text-xl">{eq.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-medium">{eq.name} <span className="text-white/40">x{count}</span></div>
                  <div className="flex gap-1 mt-0.5">
                    {Object.entries(eq.stats).map(([stat, val]) => (
                      <span key={stat} className="text-[9px] text-green-400">{stat.toUpperCase()}+{val}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => dispatch({ type: 'EQUIP_ITEM', payload: { itemId, slot: eq.slot } })}
                  className="px-2 py-1 rounded-lg text-[10px] bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                >
                  Equiper
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
