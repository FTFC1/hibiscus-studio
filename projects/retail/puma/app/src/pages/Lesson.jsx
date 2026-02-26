import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { missions } from '../data/missions'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
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

function SlideToolkit({ slide, onOpenRef }) {
  // Detect action:speech pattern (e.g. "ACKNOWLEDGE: "That's...")
  const parseItem = (item) => {
    const match = item.match(/^([A-Z][A-Z\s]+):\s*(.+)$/)
    if (match) {
      const action = match[1].trim()
      const rest = match[2].trim()
      // Split speech (in quotes) from description
      const quoteMatch = rest.match(/^(".*?"|'.*?')\s*(.*)$/)
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
      <button className="toolkit-ref-btn" onClick={(e) => { e.stopPropagation(); onOpenRef?.() }}>
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

function SlideComplete({ mission, hasQuiz, onStartQuiz, onHome }) {
  const practiceSlide = mission?.slides?.find(s => s.type === 'practice')

  return (
    <div className="slide-card glass-panel complete-card">
      <div className="complete-check-wrap">
        <div className="complete-check-circle">
          <i className="ri-check-line complete-check-icon"></i>
        </div>
      </div>
      <h2 className="complete-title">Lesson Complete</h2>
      <p className="complete-mission-name">Mission {mission?.number}: {mission?.title}</p>

      <div className="complete-progress">
        <div className="complete-progress-track">
          <div className="complete-progress-fill" style={{ width: `${((mission?.number || 1) / (mission?.totalMissions || 6)) * 100}%` }} />
        </div>
        <span className="complete-progress-text">{mission?.number}/{mission?.totalMissions || 6} missions</span>
      </div>

      {/* Practice card — framed as "do this on the floor" */}
      {practiceSlide && (
        <div className="complete-practice-card">
          <div className="complete-practice-header">
            <i className="ri-store-2-line"></i>
            <span>Practice on the Floor</span>
          </div>
          <p className="complete-practice-desc">Try these during your next shift:</p>
          <div className="complete-practice-list">
            {practiceSlide.items.map((item, i) => (
              <div key={i} className="complete-practice-item">
                <span className="complete-practice-bullet">{i + 1}</span>
                <span className="complete-practice-text">{item}</span>
              </div>
            ))}
          </div>
          {practiceSlide.encouragement && (
            <p className="complete-practice-encourage">{practiceSlide.encouragement}</p>
          )}
        </div>
      )}

      {/* Clear CTA hierarchy */}
      <div className="complete-actions">
        {hasQuiz ? (
          <button className="complete-cta-primary" onClick={onStartQuiz}>
            Take the Quiz <span className="quiz-arrow">&rarr;</span>
          </button>
        ) : (
          <button className="complete-cta-primary" onClick={onHome}>
            Continue <span className="quiz-arrow">&rarr;</span>
          </button>
        )}
        <button className="complete-cta-secondary" onClick={onHome}>
          Back to Home
        </button>
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

function SlideQuiz({ quiz, missionId, userId, startTime, onBack }) {
  const navigate = useNavigate()
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const question = quiz[qIndex]
  const total = quiz.length

  const handleSelect = async (optIndex) => {
    if (revealed) return
    const isCorrect = optIndex === question.correct

    setSelected(optIndex)
    setRevealed(true)

    const newAnswers = [
      ...answers,
      {
        id: question.id,
        question: question.question,
        selected: optIndex,
        correct: isCorrect,
        selectedText: question.options[optIndex],
        correctText: question.options[question.correct]
      }
    ]

    setTimeout(async () => {
      if (qIndex < total - 1) {
        setQIndex(i => i + 1)
        setSelected(null)
        setRevealed(false)
      } else {
        // Quiz complete — calculate score and navigate
        const correctCount = newAnswers.filter(a => a.correct).length
        const score = Math.round((correctCount / total) * 100)
        const elapsed = Math.round((Date.now() - startTime.current) / 1000)
        const wrongAnswers = newAnswers.filter(a => !a.correct)

        if (userId) {
          await supabase.from('completions').insert({
            user_id: userId,
            mission_id: missionId,
            score,
            time_spent: elapsed
          })
        }

        sessionStorage.setItem(`puma_score_${missionId}`, JSON.stringify({ score, wrongAnswers }))
        navigate(`/result/${missionId}`, { state: { score, wrongAnswers } })
      }
    }, 900)
  }

  return (
    <div className="quiz-overlay">
      <header className="lesson-top-bar">
        <button className="nav-btn back-btn" onClick={onBack}>
          <i className="ri-arrow-left-line"></i>
        </button>
        <div className="progress-dots-inline">
          {quiz.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === qIndex ? 'dot-active' : ''} ${i < qIndex ? 'dot-done' : ''}`}
            />
          ))}
        </div>
        <div style={{ width: 80 }} />
      </header>

      <div className="quiz-body">
        <p className="quiz-counter">Question {qIndex + 1} of {total}</p>
        <h2 className="quiz-question">{question.question}</h2>

        <div className="quiz-options">
          {question.options.map((opt, i) => {
            let cls = 'quiz-option'
            if (revealed) {
              if (i === question.correct) cls += ' quiz-option-correct'
              else if (i === selected) cls += ' quiz-option-wrong'
              else cls += ' quiz-option-dim'
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleSelect(i)}
                disabled={revealed}
              >
                <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
                <span className="quiz-option-text">{opt}</span>
                {revealed && i === question.correct && (
                  <i className="ri-check-line quiz-option-icon"></i>
                )}
                {revealed && i === selected && i !== question.correct && (
                  <i className="ri-close-line quiz-option-icon"></i>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Lesson() {
  const navigate = useNavigate()
  const { missionId } = useParams()
  const mission = missions[missionId]
  const { userId } = useUser()

  const [currentSlide, setCurrentSlide] = useState(0)
  const [quickRefOpen, setQuickRefOpen] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)
  const [quizMode, setQuizMode] = useState(false)
  const startTime = useRef(Date.now())

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const sliderRef = useRef(null)

  const hasQuiz = mission?.quiz && mission.quiz.length > 0

  // totalSlides is set after contentSlides is computed (below renderSlide)
  const goNext = useCallback(() => {
    // totalSlidesWithComplete is computed below; use mission.slides to derive max
    const contentCount = (mission?.slides || []).filter(s => s.type !== 'practice').length
    if (currentSlide < contentCount) setCurrentSlide(s => s + 1) // +1 for completion screen
  }, [currentSlide, mission])

  const goPrev = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide(s => s - 1)
  }, [currentSlide])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (quizMode) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, quizMode])

  // Show footer after brief delay on each slide
  useEffect(() => {
    setFooterVisible(false)
    const timer = setTimeout(() => setFooterVisible(true), 600)
    return () => clearTimeout(timer)
  }, [currentSlide])

  // Scroll to top when entering lesson
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [missionId])

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

  // Filter out practice slides — they're now embedded in the completion screen
  const contentSlides = mission.slides.filter(s => s.type !== 'practice')
  const totalContentSlides = contentSlides.length
  // Completion screen is the extra "slide" after content
  const isCompletionScreen = currentSlide === totalContentSlides
  const totalSlidesWithComplete = totalContentSlides + 1

  const renderSlide = (slide, index) => {
    switch (slide.type) {
      case 'text':
        return <SlideText slide={slide} />
      case 'rule':
        return <SlideRule slide={slide} />
      case 'toolkit':
        return <SlideToolkit slide={slide} onOpenRef={() => setQuickRefOpen(true)} />
      case 'comparison':
        return <SlideComparison slide={slide} />
      default:
        return <SlideText slide={slide} />
    }
  }

  // Quiz mode — full screen overlay
  if (quizMode && hasQuiz) {
    return (
      <SlideQuiz
        quiz={mission.quiz}
        missionId={missionId}
        userId={userId}
        startTime={startTime}
        onBack={() => setQuizMode(false)}
      />
    )
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
          {Array.from({ length: (mission.slides.filter(s => s.type !== 'practice').length) + 1 }).map((_, i) => (
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
          {contentSlides.map((slide, i) => (
            <div className="slide-wrapper" key={i}>
              {renderSlide(slide, i)}
            </div>
          ))}
          {/* Completion screen — the final "slide" */}
          <div className="slide-wrapper" key="complete">
            <SlideComplete
              mission={mission}
              hasQuiz={hasQuiz}
              onStartQuiz={() => setQuizMode(true)}
              onHome={() => navigate('/')}
            />
          </div>
        </div>
        {/* Branded texture zone below content */}
        <div className="branded-texture"></div>
      </div>

      {/* Bottom Nav — hidden on completion screen (it has its own CTAs) */}
      {!isCompletionScreen && (
        <div className={`lesson-footer ${footerVisible ? 'lesson-footer-visible' : ''}`}>
          <div className="footer-inner">
            <button
              className={`nav-btn ${currentSlide === 0 ? 'nav-btn-disabled' : ''}`}
              onClick={goPrev}
              disabled={currentSlide === 0}
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>

            <div className="footer-right">
              <button className="nav-btn" onClick={goNext}>
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Ref Overlay */}
      <QuickRefOverlay
        isOpen={quickRefOpen}
        onClose={() => setQuickRefOpen(false)}
        items={mission.quickRef}
      />
    </div>
  )
}
