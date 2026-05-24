// Helpers for the `items.target_date` field — a plain ISO date (YYYY-MM-DD)
// representing when the user wants to tick something off by.
//
// The countdown labels (`TODAY`, `TOMORROW`, `IN 12 DAYS`, `OVERDUE 3 DAYS`,
// `IN 4 MONTHS`) are designed to read at a glance on item cards.

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** YYYY-MM-DD in the user's local timezone — useful as the default for
 *  the native <input type="date"> control. */
export function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Days between today and the given YYYY-MM-DD. Positive = future, 0 = today, negative = past. */
export function daysUntil(target: string | null | undefined): number | null {
  if (!target) return null
  // Parse as local-date midnight to avoid TZ-shifting an all-day field.
  const [yy, mm, dd] = target.split('-').map(n => Number(n))
  if (!yy || !mm || !dd) return null
  const targetMid = new Date(yy, mm - 1, dd).getTime()
  const now = new Date()
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.round((targetMid - todayMid) / MS_PER_DAY)
}

type Countdown = {
  /** Short label rendered on cards, e.g. "IN 12 DAYS", "OVERDUE 3 DAYS". */
  label: string
  /** Negative = overdue; 0 = today; positive = future. */
  days: number
  /** Suggested chip background — `red` for overdue/today, `yellow` for soon, `lime` for far. */
  tone: 'overdue' | 'today' | 'soon' | 'later'
}

/** Build a display chip for a target date. Returns null when no date is set. */
export function targetCountdown(target: string | null | undefined): Countdown | null {
  const days = daysUntil(target)
  if (days === null) return null

  if (days < 0) {
    const n = Math.abs(days)
    return {
      days,
      tone: 'overdue',
      label: n === 1 ? 'OVERDUE 1 DAY' : `OVERDUE ${n} DAYS`,
    }
  }
  if (days === 0) return { days, tone: 'today', label: 'TODAY' }
  if (days === 1) return { days, tone: 'soon',  label: 'TOMORROW' }
  if (days <= 7)  return { days, tone: 'soon',  label: `IN ${days} DAYS` }
  if (days <= 30) return { days, tone: 'later', label: `IN ${days} DAYS` }
  if (days <= 365) {
    const months = Math.round(days / 30)
    return {
      days,
      tone: 'later',
      label: months === 1 ? 'IN 1 MONTH' : `IN ${months} MONTHS`,
    }
  }
  const years = Math.round(days / 365)
  return {
    days,
    tone: 'later',
    label: years === 1 ? 'IN 1 YEAR' : `IN ${years} YEARS`,
  }
}

/** Pretty calendar date for headers, e.g. "Aug 5" or "Aug 5, 2027" if not this year. */
export function formatTargetDate(target: string | null | undefined): string | null {
  if (!target) return null
  const [yy, mm, dd] = target.split('-').map(n => Number(n))
  if (!yy || !mm || !dd) return null
  const d = new Date(yy, mm - 1, dd)
  const now = new Date()
  const sameYear = d.getFullYear() === now.getFullYear()
  return d.toLocaleDateString('en-US', sameYear
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' })
}
