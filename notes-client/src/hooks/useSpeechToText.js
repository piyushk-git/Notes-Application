import { useState, useCallback, useRef, useEffect } from 'react'

function RecognitionClass() {
  return window.SpeechRecognition || window.webkitSpeechRecognition
}

/**
 * Web Speech API dictation (Chrome / Edge). Restarts the session after each pause
 * so long-form dictation keeps working (Chrome ends the session after silence).
 */
export function useSpeechToText() {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const [error, setError] = useState('')
  const activeRef = useRef(false)
  const onResultRef = useRef(null)
  const recRef = useRef(null)
  const sessionIdRef = useRef(0)

  useEffect(() => {
    setSupported(Boolean(RecognitionClass()))
  }, [])

  const stop = useCallback(() => {
    sessionIdRef.current += 1
    activeRef.current = false
    onResultRef.current = null
    try {
      recRef.current?.abort?.()
    } catch {
      try {
        recRef.current?.stop?.()
      } catch {
        /* ignore */
      }
    }
    recRef.current = null
    setListening(false)
    setError('')
  }, [])

  const startSession = useCallback(() => {
    const Ctor = RecognitionClass()
    if (!Ctor || !activeRef.current) return

    const sessionId = sessionIdRef.current
    const rec = new Ctor()
    recRef.current = rec

    rec.lang = (navigator.language || 'en-US').replace('_', '-')
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = (event) => {
      if (sessionId !== sessionIdRef.current) return
      const onResult = onResultRef.current
      if (!onResult) return
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const segment = event.results[i]
        const text = segment[0]?.transcript
        if (!text?.trim()) continue
        if (segment.isFinal) {
          onResult(text)
        }
      }
    }

    rec.onerror = (e) => {
      if (sessionId !== sessionIdRef.current) return
      if (e.error === 'aborted') return
      if (e.error === 'no-speech') {
        if (activeRef.current) {
          window.setTimeout(() => {
            if (sessionId === sessionIdRef.current && activeRef.current) startSession()
          }, 200)
        }
        return
      }
      if (e.error === 'not-allowed') {
        setError('Microphone blocked — allow access in the browser address bar.')
        activeRef.current = false
        setListening(false)
        return
      }
      setError(e.message || e.error || 'Speech error')
      activeRef.current = false
      setListening(false)
    }

    rec.onend = () => {
      if (sessionId !== sessionIdRef.current) return
      recRef.current = null
      if (activeRef.current) {
        window.setTimeout(() => {
          if (sessionId === sessionIdRef.current && activeRef.current) startSession()
        }, 0)
      } else {
        setListening(false)
      }
    }

    try {
      rec.start()
    } catch (e) {
      setError(e.message || 'Could not start microphone')
      activeRef.current = false
      setListening(false)
    }
  }, [])

  const start = useCallback(
    (onResult) => {
      const Ctor = RecognitionClass()
      if (!Ctor) {
        setError('Speech recognition is not supported in this browser. Try Chrome or Edge.')
        return
      }
      sessionIdRef.current += 1
      try {
        recRef.current?.abort?.()
      } catch {
        try {
          recRef.current?.stop?.()
        } catch {
          /* ignore */
        }
      }
      recRef.current = null

      activeRef.current = true
      onResultRef.current = onResult
      setError('')
      setListening(true)
      startSession()
    },
    [startSession]
  )

  useEffect(() => () => stop(), [stop])

  return { supported, listening, error, start, stop, setError }
}
