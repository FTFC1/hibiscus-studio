import { useState, useCallback, useEffect, useRef } from 'react'
import { Tldraw, createShapeId, AssetRecordType, getSnapshot, loadSnapshot } from 'tldraw'
import 'tldraw/tldraw.css'

const SCREEN_W = 412
const SCREEN_H = 915
const GAP = 60
const MAX_DISPLAY_CHARS = 200
const STORAGE_KEY = 'puma-review-snapshot'

function findNearestScreen(x) {
  return Math.max(0, Math.floor(x / (SCREEN_W + GAP)))
}

export default function Review() {
  const [editor, setEditor] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const saveTimer = useRef(null)

  // Auto-save to localStorage on changes
  useEffect(() => {
    if (!editor) return
    const save = () => {
      try {
        const snapshot = getSnapshot(editor.store)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
      } catch (_) { /* quota exceeded — ignore */ }
    }
    const unsub = editor.store.listen(() => {
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(save, 500)
    }, { scope: 'document' })
    return () => { unsub(); clearTimeout(saveTimer.current) }
  }, [editor])

  // Voice note paste handler
  useEffect(() => {
    if (!editor) return
    function onPaste(e) {
      const text = e.clipboardData?.getData('text/plain')
      if (!text || text.length < 10) return
      e.preventDefault()
      e.stopPropagation()

      const camera = editor.getCamera()
      const viewport = editor.getViewportScreenBounds()
      const cx = (-camera.x + viewport.w / 2 / camera.z)
      const cy = (-camera.y + viewport.h / 2 / camera.z)
      const screenIdx = findNearestScreen(cx)
      const display = text.length > MAX_DISPLAY_CHARS
        ? text.slice(0, MAX_DISPLAY_CHARS) + '…'
        : text

      editor.createShape({
        id: createShapeId(),
        type: 'note',
        x: cx,
        y: cy,
        props: {
          text: display,
          color: 'violet',
          size: 'm',
        },
        meta: {
          source: 'voice',
          fullText: text,
          nearScreen: screenIdx,
          timestamp: new Date().toISOString(),
        },
      })
    }
    const el = document.querySelector('.tl-container')
    if (el) {
      el.addEventListener('paste', onPaste, true)
      return () => el.removeEventListener('paste', onPaste, true)
    }
  }, [editor])

  const handleMount = useCallback(async (ed) => {
    setEditor(ed)
    try {
      // Restore from localStorage if available
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          loadSnapshot(ed.store, JSON.parse(saved))
          setLoaded(true)
          return
        } catch (_) {
          localStorage.removeItem(STORAGE_KEY)
        }
      }

      const res = await fetch('/screenshots/manifest.json')
      const manifest = await res.json()

      for (let i = 0; i < manifest.length; i++) {
        const item = manifest[i]
        const assetId = AssetRecordType.createId()

        ed.createAssets([{
          id: assetId,
          type: 'image',
          typeName: 'asset',
          props: {
            name: item.file,
            src: `/screenshots/${item.file}`,
            w: SCREEN_W,
            h: SCREEN_H,
            mimeType: 'image/png',
            isAnimated: false,
          },
          meta: {},
        }])

        ed.createShape({
          id: createShapeId(),
          type: 'image',
          x: i * (SCREEN_W + GAP),
          y: 0,
          isLocked: true,
          props: {
            assetId,
            w: SCREEN_W,
            h: SCREEN_H,
          },
          meta: {
            screenName: item.name,
            label: item.label,
          },
        })
      }

      ed.zoomToFit({ animation: { duration: 300 } })
      setLoaded(true)
    } catch (err) {
      console.error('Failed to load screenshots:', err)
    }
  }, [])

  const handleExport = useCallback(() => {
    if (!editor) return

    const snapshot = getSnapshot(editor.store)

    const annotations = Object.values(snapshot.document.store)
      .filter(r => {
        if (r.typeName !== 'shape') return false
        if (r.isLocked) return false
        return ['note', 'text', 'arrow', 'draw', 'geo'].includes(r.type)
      })
      .map(shape => ({
        type: shape.type,
        x: shape.x,
        y: shape.y,
        text: shape.props?.richText || shape.props?.text || '',
        color: shape.props?.color || '',
        meta: shape.meta || {},
        nearScreen: Math.floor(shape.x / (SCREEN_W + GAP)),
      }))

    const reviewData = {
      exportedAt: new Date().toISOString(),
      screenCount: Object.values(snapshot.document.store)
        .filter(r => r.typeName === 'shape' && r.type === 'image' && r.isLocked).length,
      annotations,
      fullSnapshot: snapshot,
    }

    const blob = new Blob([JSON.stringify(reviewData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `review-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [editor])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1a1a2e' }}>
      <div style={{
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1000,
        display: 'flex',
        gap: 8,
      }}>
        <button
          onClick={handleExport}
          style={{
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Export Review
        </button>
        <a
          href="/"
          style={{
            background: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontSize: 14,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Back to App
        </a>
      </div>
      {!loaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666',
          fontSize: 14,
          zIndex: 999,
          pointerEvents: 'none',
        }}>
          Loading screenshots...
        </div>
      )}
      <Tldraw onMount={handleMount} />
    </div>
  )
}
