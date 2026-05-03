/** Strip HTML for previews and search (safe for untrusted server content in same-origin app). */
export function stripHtml(html) {
  if (!html || typeof html !== 'string') return ''
  const d = document.createElement('div')
  d.innerHTML = html
  return (d.textContent || d.innerText || '').replace(/\s+/g, ' ').trim()
}

/** Days since a date (floor). */
export function daysSince(iso) {
  if (!iso) return Infinity
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return Infinity
  return Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24))
}

/** Notes with weak topics that are due for revision (weekly cadence after first review). */
export function needsWeakTopicRevision(note) {
  const topics = note.weakTopics
  if (!topics?.length) return false
  if (!note.lastReviewedAt) return true
  return daysSince(note.lastReviewedAt) >= 7
}
