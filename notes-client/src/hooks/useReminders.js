import { useEffect, useRef } from 'react'

const STORAGE_KEY = 'notekeep_reminder_fired_v1'

function loadMap() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveMap(map) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

/**
 * Browser notifications when note.reminderAt is due (polling while app is open).
 */
export function useReminders(notes) {
  const asked = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return undefined

    const tick = () => {
      if (Notification.permission === 'default' && !asked.current) {
        asked.current = true
        Notification.requestPermission().catch(() => {})
      }
      if (Notification.permission !== 'granted') return

      const now = Date.now()
      const map = loadMap()

      for (const n of notes) {
        if (!n?.reminderAt) {
          delete map[n._id]
          continue
        }
        const at = new Date(n.reminderAt).getTime()
        if (Number.isNaN(at)) continue

        if (at > now) {
          delete map[n._id]
          continue
        }

        if (map[n._id] === n.reminderAt) continue

        map[n._id] = n.reminderAt
        try {
          new Notification(`Reminder: ${n.title || 'Note'}`, {
            body: 'Open NoteKeep to view this note.',
            tag: `${n._id}:${n.reminderAt}`,
          })
        } catch {
          /* ignore */
        }
      }

      saveMap(map)
    }

    tick()
    const id = window.setInterval(tick, 45_000)
    return () => window.clearInterval(id)
  }, [notes])
}
