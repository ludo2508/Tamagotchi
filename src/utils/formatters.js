// Number formatting for large values
export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return '0'

  const abs = Math.abs(num)

  if (abs >= 1e15) return (num / 1e15).toFixed(2) + ' Qa'
  if (abs >= 1e12) return (num / 1e12).toFixed(2) + ' T'
  if (abs >= 1e9) return (num / 1e9).toFixed(2) + ' B'
  if (abs >= 1e6) return (num / 1e6).toFixed(2) + ' M'
  if (abs >= 1e4) return (num / 1e3).toFixed(1) + ' K'
  if (abs >= 1000) return Math.floor(num).toLocaleString('fr-FR')

  if (Number.isInteger(num)) return num.toString()
  return num.toFixed(1)
}

// Format time duration
export function formatDuration(seconds) {
  if (seconds < 60) return `${Math.floor(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  return `${days}j ${hours}h`
}

// Format age in human-readable form
export function formatAge(hours) {
  if (hours < 1) return `${Math.floor(hours * 60)}min`
  if (hours < 24) return `${Math.floor(hours)}h`
  if (hours < 168) return `${Math.floor(hours / 24)}j ${Math.floor(hours % 24)}h`
  if (hours < 720) return `${Math.floor(hours / 168)} sem`
  return `${Math.floor(hours / 720)} mois`
}

// Percentage with color
export function getStatColor(value) {
  if (value > 70) return '#22c55e'  // green
  if (value > 40) return '#eab308'  // yellow
  if (value > 20) return '#f97316'  // orange
  return '#ef4444'                   // red
}

// Clamp value between min and max
export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}
