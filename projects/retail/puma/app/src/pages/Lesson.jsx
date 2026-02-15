import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { missions } from '../data/missions'
import './Lesson.css'

function SlideText({ slide }) {
  return (
    <div className="slide-card glass-panel">
      <div className="slide-header">
        <i className={`${slide.icon} slide-icon`}></i>
        <h2 className="slide-title">{slide.title}</h2>
      </div>
      {/* Visual scenario */}
      {slide.scenario && (
        <div className="scenario-flow">
          {slide.scenario.map((step, i) => (
            <div className="scenario-step" key={i}>
              <div className={`scenario-icon-wrap ${step.tone || ''}`}>
                <i className={step.icon}></i>
              </div>
              <span className="scenario-label">{step.label}</span>
              {i < slide.scenario.length - 1 && (
                <i className="ri-arrow-right-s-line scenario-arrow"></i>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="slide-body">
        {slide.body}
        {slide.highlight && (
          <> <span className="slide-bold">{slide.highlight}</span></>
        )}
      </p>
    </div>
  )
}

function SlideRule({ slide }) {
  const hasMeanings = slide.body && slide.body.includes(' · ')
  const meanings = hasMeanings ? slide.body.split(' · ').map(s => s.trim()) : null

  return (
    <div className="slide-card slide-card-lime">
      <div className="slide-header">
        <i className={`${slide.icon} slide-icon slide-icon-lime`}></i>
        <h2 className="slide-title">{slide.title}</h2>
      </div>
      {slide.bar ? (
        <div className="rule-bar-row">
          <div className="rule-bar-track">
            <div className="rule-bar-fill rule-bar-70">
              <i className="ri-user-voice-line rule-bar-icon"></i>
            </div>
            <div className="rule-bar-fill rule-bar-30">
            </div>
          </div>
          <div className="rule-bar-labels">
            <span className="rule-bar-label-left">{slide.stats[0].label}</span>
            <span className="rule-bar-label-right">{slide.stats[1].label}</span>
          </div>
        </div>
      ) : (
        <div className="rule-stats">
          {slide.stats.map((stat, i) => (
            <div className="rule-stat" key={i}>
              <span className="rule-stat-value">{stat.value}</span>
              <span className="rule-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
      {meanings ? (
        <div className="rule-meanings">
          {meanings.map((m, i) => (
            <div className="rule-meaning" key={i}>
              <span className="rule-meaning-bullet"></span>
              <span className="rule-meaning-text">{m}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="slide-body slide-body-white">{slide.body}</p>
      )}
    </div>
  )
}

function SlideToolkit({ slide }) {
  // Detect action:speech pattern (e.g. "ACKNOWLEDGE: "That's...")
  const parseItem = (item) => {
    const match = item.match(/^([A-Z][A-Z\s]+):\s*(.+)$/)
    if (match) {
      const action = match[1].trim()
      const rest = match[2].trim()
      // Split speech (in quotes) from description
      const quoteMatch = rest.match(/^(["'].+?["'])\s*(.*)$/)
      if (quoteMatch) {
        return { action, quote: quoteMatch[1], desc: quoteMatch[2] || null }
      }
      return { action, quote: null, desc: rest }
    }
    return { action: null, quote: null, desc: item }
  }

  const parsed = slide.items.map(parseItem)
  const hasActions = parsed.some(p => p.action)

  return (
    <div className="slide-card glass-panel">
      <div className="slide-header">
        <i className={`${slide.icon} slide-icon`}></i>
        <h2 className="slide-title">{slide.title}</h2>
      </div>
      <div className="toolkit-list">
        {parsed.map((p, i) => (
          <div key={i}>
            {hasActions && p.action ? (
              <div className="toolkit-step">
                <div className="toolkit-step-header">
                  <span className="toolkit-num">{i + 1}.</span>
                  <span className="toolkit-action">{p.action}</span>
                </div>
                <div className="toolkit-quote">
                  <i className="ri-chat-quote-line toolkit-quote-icon"></i>
                  <div className="toolkit-quote-content">
                    {p.quote && <span className="toolkit-quote-text">{p.quote}</span>}
                    {p.desc && <span className="toolkit-quote-desc">{p.desc}</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="toolkit-item">
                <span className="toolkit-num">{i + 1}.</span>
                <span className="toolkit-text">{p.desc}</span>
              </div>
            )}
            {i < slide.items.length - 1 && (
              <div className="toolkit-arrow">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            )}
          </div>
        ))}
      </div>
      {slide.footnote && (
        <p className="toolkit-footnote">{slide.footnote}</p>
      )}
      <button className="toolkit-ref-btn" onClick={(e) => e.stopPropagation()}>
        <i className="ri-bookmark-3-line"></i>
        <span>View Reference</span>
      </button>
    </div>
  )
}

function SlideComparison({ slide }) {
  return (
    <div className="slide-card glass-panel">
      <div className="slide-header">
        <i className={`${slide.icon} slide-icon`}></i>
        <h2 className="slide-title">{slide.title}</h2>
      </div>
      <div className="comparison-blocks">
        <div className="comparison-card comparison-card-bad">
          <div className="comparison-card-top">
            <i className="ri-close-circle-line comparison-card-icon comparison-icon-bad"></i>
            <span className="comparison-pill comparison-dont">Don't</span>
          </div>
          <p className="comparison-text comparison-text-bad">{slide.dont}</p>
          <div className="comparison-result comparison-result-bad">
            <i className="ri-walk-line"></i>
            <span>They leave</span>
          </div>
        </div>
        <div className="comparison-card comparison-card-good">
          <div className="comparison-card-top">
            <i className="ri-checkbox-circle-line comparison-card-icon comparison-icon-good"></i>
            <span className="comparison-pill comparison-do">Do</span>
          </div>
          <p className="comparison-text comparison-text-good">{slide.do}</p>
          <div className="comparison-result comparison-result-good">
            <i className="ri-shopping-bag-3-line"></i>
            <span>They buy</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SlidePractice({ slide, checked, onToggle, allChecked }) {
  return (
    <div className="slide-card glass-panel practice-card">
      <div className="slide-header">
        <i className={`${slide.icon} slide-icon slide-icon-lime`}></i>
        <h2 className="slide-title">{slide.title}</h2>
      </div>
      {slide.encouragement && (
        <p className="practice-encouragement">{slide.encouragement}</p>
      )}
      <button className="practice-ready-btn" onClick={(e) => { e.stopPropagation() }}>
        {allChecked ? (
          <><i className="ri-check-double-line"></i> Ready for Today</>
        ) : (
          <><i className="ri-play-circle-line"></i> Start My Day</>
        )}
      </button>
      <div className="practice-list">
        {slide.items.map((item, i) => {
          const isChecked = checked.has(i)
          return (
            <div
              className="practice-item"
              key={i}
              onClick={() => onToggle(i)}
            >
              <div className={`practice-circle ${isChecked ? 'practice-circle-checked' : ''}`}>
                {isChecked && <i className="ri-check-line practice-check-icon"></i>}
              </div>
              <span className={`practice-label ${isChecked ? 'practice-label-checked' : ''}`}>
                {item}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QuickRefOverlay({ isOpen, onClose, items }) {
  return (
    <div className={`qr-overlay ${isOpen ? 'qr-overlay-open' : ''}`}>
      <div className="qr-backdrop" onClick={onClose}></div>
      <div className={`qr-sheet ${isOpen ? 'qr-sheet-open' : ''}`}>
        <div className="qr-sheet-header">
          <h3 className="qr-sheet-title">Quick Reference</h3>
        </div>
        <div className="qr-grid">
          {items.map((item, i) => (
            <div className="qr-card" key={i}>
              <div className="qr-num">{item.num}</div>
              <div className="qr-label">{item.label}</div>
              <p className="qr-question">{item.question}</p>
              {item.examples && (
                <div className="qr-examples">
                  {item.examples.map((ex, j) => (
                    <span className="qr-example-tag" key={j}>{ex}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="qr-close-btn-bottom" onClick={onClose}>
          <i className="ri-close-line"></i>
          <span>Close</span>
        </button>
      </div>
    </div>
  )
}

export default function Lesson() {
  const navigate = useNavigate()
  const { missionId } = useParams()
  const mission = missions[missionId]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [quickRefOpen, setQuickRefOpen] = useState(false)
  const [checked, setChecked] = useState(new Set())
  const [footerVisible, setFooterVisible] = useState(false)

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const sliderRef = useRef(null)

  const totalSlides = mission?.slides?.length || 0
  const isLastSlide = currentSlide === totalSlides - 1
  const isFirstSlide = currentSlide === 0

  const goNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) setCurrentSlide(s => s + 1)
  }, [currentSlide, totalSlides])

  const goPrev = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide(s => s - 1)
  }, [currentSlide])

  const toggleCheck = useCallback((index) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  // Show footer after brief delay on each slide
  useEffect(() => {
    setFooterVisible(false)
    const timer = setTimeout(() => setFooterVisible(true), 600)
    return () => clearTimeout(timer)
  }, [currentSlide])

  // Touch swipe handlers — horizontal only, prevent iOS back gesture
  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX
    touchStartY.current = e.changedTouches[0].screenY
  }

  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX.current
    const dy = e.changedTouches[0].screenY - touchStartY.current
    // Only trigger swipe if horizontal movement > vertical (not scrolling)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < -40) goNext()
      if (dx > 40) goPrev()
    }
  }

  if (!mission) {
    return (
      <div className="lesson-page" style={{ padding: 40, textAlign: 'center' }}>
        <p>Mission not found.</p>
        <button className="nav-btn" onClick={() => navigate('/')}>
          <i className="ri-arrow-left-line"></i>
        </button>
      </div>
    )
  }

  const renderSlide = (slide, index) => {
    switch (slide.type) {
      case 'text':
        return <SlideText slide={slide} />
      case 'rule':
        return <SlideRule slide={slide} />
      case 'toolkit':
        return <SlideToolkit slide={slide} />
      case 'comparison':
        return <SlideComparison slide={slide} />
      case 'practice':
        return <SlidePractice slide={slide} checked={checked} onToggle={toggleCheck} allChecked={checked.size === slide.items.length} />
      default:
        return <SlideText slide={slide} />
    }
  }

  return (
    <div
      className="lesson-page"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={(e) => { touchStartX.current = e.screenX; touchStartY.current = e.screenY }}
      onMouseUp={(e) => {
        const dx = e.screenX - touchStartX.current
        const dy = e.screenY - touchStartY.current
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx < -40) goNext()
          if (dx > 40) goPrev()
        }
      }}
    >
      {/* Top Bar — just back button + progress dots */}
      <header className="lesson-top-bar">
        <button className="nav-btn back-btn" onClick={(e) => { e.stopPropagation(); navigate('/') }}>
          <i className="ri-arrow-left-line"></i>
        </button>
        <div className="progress-dots-inline">
          {mission.slides.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === currentSlide ? 'dot-active' : ''} ${i < currentSlide ? 'dot-done' : ''}`}
            />
          ))}
        </div>
        <button
          className="nav-btn qr-btn-top"
          onClick={(e) => { e.stopPropagation(); setQuickRefOpen(true) }}
        >
          <i className="ri-bookmark-3-line"></i>
          <span>Reference</span>
        </button>
      </header>

      {/* Slides — full page is swipe area */}
      <div
        className="slides-viewport"
        ref={sliderRef}
      >
        <div
          className="slides-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {mission.slides.map((slide, i) => (
            <div className="slide-wrapper" key={i}>
              {renderSlide(slide, i)}
            </div>
          ))}
        </div>
        {/* Branded texture zone below content */}
        <div className="branded-texture"></div>
      </div>

      {/* Bottom Nav — appears dynamically */}
      <div className={`lesson-footer ${footerVisible ? 'lesson-footer-visible' : ''}`}>
        <div className="footer-inner">
          <button
            className={`nav-btn ${isFirstSlide ? 'nav-btn-disabled' : ''}`}
            onClick={goPrev}
            disabled={isFirstSlide}
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>

          <div className="footer-right">
            {isLastSlide ? (
              <button className="quiz-btn" onClick={() => {}}>
                Take Quiz <span className="quiz-arrow">&rarr;</span>
              </button>
            ) : (
              <button className="nav-btn" onClick={goNext}>
                <i className="ri-arrow-right-s-line"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Ref Overlay */}
      <QuickRefOverlay
        isOpen={quickRefOpen}
        onClose={() => setQuickRefOpen(false)}
        items={mission.quickRef}
      />
    </div>
  )
}
