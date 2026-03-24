import { useState, useRef, useCallback, useEffect, Fragment } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { missions } from '../data/missions'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import './Lesson.css'

function SlideObjectives({ mission }) {
  return (
    <div className="slide-card glass-panel objectives-card">
      <div className="objectives-badge">Mission {mission.number}</div>
      <h2 className="objectives-title">{mission.title}</h2>
      <p className="objectives-label">After this lesson you'll be able to:</p>
      <div className="objectives-list">
        {mission.objectives.map((obj, i) => (
          <div key={i} className="objectives-item">
            <span className="objectives-check"><i className="ri-check-line"></i></span>
            <span className="objectives-text">{obj}</span>
          </div>
        ))}
      </div>
      <div className="objectives-meta">
        <i className="ri-time-line"></i>
        <span>{mission.readTime}</span>
      </div>
    </div>
  )
}

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
  const defaultFlow = [
    { icon: 'ri-eye-line', time: '5s', label: 'Acknowledge' },
    { icon: 'ri-walk-line', time: '30s', label: 'Approach' },
    { icon: 'ri-chat-smile-2-line', time: '60s', label: 'Engage' }
  ]
  const defaultStats = [
    { value: '+20%', label: 'more spent when greeted', source: 'Consumer Electronics Study', color: 'var(--accent-lime)' },
    { value: '3 min', label: 'avg customer patience', source: 'Retail Research', color: 'var(--accent-purple)' },
    { value: '+1 item', label: 'per basket with help', source: 'Lithuanian Retail Study', color: 'var(--accent-orange)' },
    { value: '68%', label: 'leave if ignored', source: 'PwC', color: 'var(--alert-red, #FF6464)' }
  ]
  const flow = slide.flow || defaultFlow
  // Old missions.js stats have 3 items (time values) — use defaultStats for bento (4 research-backed items)
  const stats = (slide.stats && slide.stats.length === 4 && slide.stats[0].color) ? slide.stats : defaultStats

  return (
    <div className="slide-card slide-card-lime">
      <div className="slide-header">
        <i className={`${slide.icon} slide-icon slide-icon-lime`}></i>
        <h2 className="slide-title">{slide.title}</h2>
      </div>
      <div className="rule-flow">
        {flow.map((step, i) => (
          <Fragment key={i}>
            {i > 0 && <i className="ri-arrow-right-s-line rule-flow-arrow"></i>}
            <div className="rule-flow-step">
              <div className="rule-flow-icon"><i className={step.icon}></i></div>
              <span className="rule-flow-time">{step.time}</span>
              <span className="rule-flow-label">{step.label}</span>
            </div>
          </Fragment>
        ))}
      </div>
      <div className="rule-bento">
        {stats.map((stat, i) => (
          <div className="rule-bento-card" key={i}>
            <div className="rule-bento-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="rule-bento-label">{stat.label}</div>
            {stat.source && <div className="rule-bento-source">{stat.source}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideToolkit({ slide, onOpenRef }) {
  const [favorites, setFavorites] = useState(new Set())
  const defaultEmojis = ['👋', '👟', '🎁', '🔥']

  const toggleFavorite = (index) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const items = slide.items || []

  return (
    <div className="slide-card glass-panel">
      <div className="slide-header">
        <i className={`${slide.icon} slide-icon`}></i>
        <h2 className="slide-title">{slide.title}</h2>
      </div>
      {items.map((item, i) => {
        const text = typeof item === 'string' ? item : item.text || item
        const emoji = (typeof item === 'object' && item.emoji) ? item.emoji : defaultEmojis[i % defaultEmojis.length]
        return (
          <div
            key={i}
            className={`opener-card ${favorites.has(i) ? 'selected' : ''}`}
            onClick={() => toggleFavorite(i)}
            role="button"
            tabIndex={0}
            aria-pressed={favorites.has(i)}
            aria-label={`${typeof item === 'string' ? item : item.text || item} — ${favorites.has(i) ? 'selected' : 'tap to select'}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFavorite(i) } }}
          >
            <div className="opener-emoji">{emoji}</div>
            <div className="opener-text">{text}</div>
            <span className="opener-star">
              <i className={favorites.has(i) ? 'ri-star-fill' : 'ri-star-line'}></i>
            </span>
          </div>
        )
      })}
      <div className="opener-hint">
        <i className="ri-star-line"></i> Tap to pick your favourite
      </div>
      <button className="toolkit-ref-btn" onClick={(e) => { e.stopPropagation(); onOpenRef?.() }}>
        <i className="ri-bookmark-3-line"></i>
        <span>View Reference</span>
      </button>
    </div>
  )
}

function SlideComparison({ slide }) {
  const [mode, setMode] = useState('dont')

  const dontBullets = slide.dontBullets || [
    { icon: 'ri-door-open-line', text: slide.dont || 'Customer walks in — no greeting' }
  ]
  const doBullets = slide.doBullets || [
    { icon: 'ri-hand-heart-line', text: slide.do || 'Greet within 5 seconds' }
  ]
  const dontResult = slide.dontResult || 'Sale lost'
  const doResult = slide.doResult || 'Sale made'

  return (
    <div className="slide-card glass-panel">
      <div className="slide-header">
        <i className={`${slide.icon} slide-icon`}></i>
        <h2 className="slide-title">{slide.title}</h2>
      </div>
      <div className="compare-toggle">
        <button
          className={`compare-toggle-btn ${mode === 'dont' ? 'active' : ''}`}
          data-target="dont"
          onClick={() => setMode('dont')}
        >
          <i className="ri-close-circle-line"></i> Don't
        </button>
        <button
          className={`compare-toggle-btn ${mode === 'do' ? 'active' : ''}`}
          data-target="do"
          onClick={() => setMode('do')}
        >
          <i className="ri-checkbox-circle-line"></i> Do
        </button>
      </div>

      {mode === 'dont' && (
        <div className="compare-panel" style={{ display: 'flex' }}>
          <div className="compare-bullets">
            {dontBullets.map((b, i) => (
              <div className="compare-bullet bad" key={i}>
                <i className={b.icon}></i>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
          <div className="comparison-result comparison-result-bad">
            <i className="ri-walk-line"></i>
            <span>{dontResult}</span>
          </div>
        </div>
      )}

      {mode === 'do' && (
        <div className="compare-panel" style={{ display: 'flex' }}>
          <div className="compare-bullets">
            {doBullets.map((b, i) => (
              <div className="compare-bullet good" key={i}>
                <i className={b.icon}></i>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
          <div className="comparison-result comparison-result-good">
            <i className="ri-shopping-bag-3-line"></i>
            <span>{doResult}</span>
          </div>
        </div>
      )}
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
    <div className={`qr-overlay ${isOpen ? 'qr-overlay-open' : ''}`} role="dialog" aria-label="Quick Reference" aria-modal="true">
      <div className="qr-backdrop" onClick={onClose} aria-label="Close reference overlay" role="button" tabIndex={isOpen ? 0 : -1}></div>
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

function SlideQuiz({ quiz, missionId, userId, startTime, onBack, isReview }) {
  const navigate = useNavigate()

  // Restore quiz progress from sessionStorage on mount (F16/F32/F33)
  const savedProgress = (() => {
    try {
      const raw = sessionStorage.getItem(`puma_quiz_progress_${missionId}`)
      if (raw) return JSON.parse(raw)
    } catch {}
    return null
  })()

  const [qIndex, setQIndex] = useState(savedProgress?.qIndex ?? 0)
  const [answers, setAnswers] = useState(savedProgress?.answers ?? [])
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [waitingForNext, setWaitingForNext] = useState(false)
  const answersRef = useRef(savedProgress?.answers ?? [])

  const question = quiz[qIndex]
  const total = quiz.length

  const advanceQuiz = async () => {
    const newAnswers = answersRef.current
    if (qIndex < total - 1) {
      setQIndex(i => i + 1)
      setSelected(null)
      setRevealed(false)
      setWaitingForNext(false)
    } else {
      const correctCount = newAnswers.filter(a => a.correct).length
      const score = Math.round((correctCount / total) * 100)
      const elapsed = Math.round((Date.now() - startTime.current) / 1000)
      const wrongAnswers = newAnswers.filter(a => !a.correct)

      const passed = score >= 67
      if (userId && passed) {
        try {
          // Upsert: update existing row if retaking, keep highest score
          const { data: existing } = await supabase
            .from('completions')
            .select('id, score')
            .eq('user_id', userId)
            .eq('mission_id', missionId)
            .order('score', { ascending: false })
            .limit(1)
            .single()

          if (existing && score <= existing.score) {
            // Already have a better or equal score — skip write
          } else if (existing) {
            // Update existing row with better score
            const { error } = await supabase
              .from('completions')
              .update({ score, time_spent: elapsed })
              .eq('id', existing.id)
            if (error) console.error('Completion update failed:', error)
          } else {
            // First completion — insert
            const { error } = await supabase.from('completions').insert({
              user_id: userId,
              mission_id: missionId,
              score,
              time_spent: elapsed
            })
            if (error) console.error('Completion save failed:', error)
          }
        } catch (err) {
          console.error('Completion save failed:', err)
        }
      }

      sessionStorage.setItem(`puma_score_${missionId}`, JSON.stringify({ score, wrongAnswers }))
      sessionStorage.removeItem(`puma_quiz_progress_${missionId}`)
      navigate(`/result/${missionId}`, { state: { score, wrongAnswers, isReview } })
    }
  }

  const handleSelect = (optIndex) => {
    if (revealed || isReview) return
    const isCorrect = optIndex === question.correct

    setSelected(optIndex)
    setRevealed(true)

    const newAnswer = {
      id: question.id,
      question: question.question,
      selected: optIndex,
      correct: isCorrect,
      selectedText: question.options[optIndex],
      correctText: question.options[question.correct]
    }
    answersRef.current = [...answersRef.current, newAnswer]
    setAnswers(answersRef.current)

    // Persist quiz progress so page refresh doesn't destroy it (F16/F32)
    sessionStorage.setItem(`puma_quiz_progress_${missionId}`, JSON.stringify({
      qIndex: qIndex + 1,
      answers: answersRef.current
    }))

    // Always wait for manual "Next" — no auto-advance (Tinder pattern + DR07/DR11)
    setWaitingForNext(true)
  }

  return (
    <div className="quiz-overlay">
      <header className="lesson-top-bar">
        <button className="nav-btn back-btn" onClick={() => {
          if (qIndex > 0 && !window.confirm('Leave quiz? Your progress will be lost.')) return
          onBack()
        }} aria-label="Go back to lesson">
          <i className="ri-arrow-left-line" aria-hidden="true"></i>
        </button>
        <div className="quiz-progress-bar">
          {quiz.map((_, i) => {
            let segClass = 'seg'
            if (i < qIndex) {
              // Already answered — check if correct or wrong
              const ans = answersRef.current[i]
              segClass += ans?.correct ? ' seg-correct' : ' seg-wrong'
            } else if (i === qIndex) {
              segClass += ' seg-current'
            }
            return <div key={i} className={segClass} />
          })}
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
                aria-label={`${String.fromCharCode(65 + i)} ${opt}`}
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

        {/* Verdict label */}
        {revealed && (
          <p className={`quiz-verdict ${selected === question.correct ? 'quiz-verdict-correct' : 'quiz-verdict-wrong'}`}>
            {selected === question.correct ? 'Correct!' : 'Not quite'}
          </p>
        )}

        {/* Explanation — collapsible "Why?" toggle (C04 progressive disclosure) */}
        {revealed && (selected !== question.correct) && (
          <p className="quiz-correct-answer-line">
            The answer is <strong>{question.options[question.correct]}</strong>
          </p>
        )}
        {revealed && question.explanation && (
          <details className={`quiz-explanation ${selected === question.correct ? 'quiz-explanation-correct' : 'quiz-explanation-wrong'}`}>
            <summary className="quiz-why-btn">
              <i className="ri-lightbulb-line"></i> Why?
            </summary>
            <p className="quiz-why-text">{question.explanation}</p>
          </details>
        )}

        {waitingForNext && (
          <button className="quiz-next-btn" onClick={advanceQuiz}>
            {qIndex < total - 1 ? 'Next Question' : 'See Results'} <span>&rarr;</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default function Lesson() {
  const navigate = useNavigate()
  const location = useLocation()
  const { missionId } = useParams()
  const mission = missions[missionId]
  const { userId } = useUser()
  const isReview = location.state?.isReview || false

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
    const objOffset = (mission?.objectives && mission.objectives.length > 0) ? 1 : 0
    if (currentSlide < contentCount + objOffset) setCurrentSlide(s => s + 1) // +1 for completion screen
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
  const hasObjectives = mission.objectives && mission.objectives.length > 0
  const totalContentSlides = contentSlides.length + (hasObjectives ? 1 : 0)
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
        isReview={isReview}
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
        <button className="nav-btn back-btn" onClick={(e) => { e.stopPropagation(); navigate(-1) }} aria-label="Go back">
          <i className="ri-arrow-left-line" aria-hidden="true"></i>
        </button>
        <div className="progress-dots-inline">
          {Array.from({ length: totalSlidesWithComplete }).map((_, i) => (
            <div
              key={i}
              className={`dot ${i === currentSlide ? 'dot-active' : ''} ${i < currentSlide ? 'dot-done' : ''}`}
            />
          ))}
        </div>
        <button
          className="nav-btn qr-btn-top"
          onClick={(e) => { e.stopPropagation(); setQuickRefOpen(true) }}
          aria-label="Open quick reference"
        >
          <i className="ri-bookmark-3-line" aria-hidden="true"></i>
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
          {hasObjectives && (
            <div className="slide-wrapper" key="objectives">
              <SlideObjectives mission={mission} />
            </div>
          )}
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
              className={`nav-pill nav-pill-back ${currentSlide === 0 ? 'nav-pill-disabled' : ''}`}
              onClick={goPrev}
              disabled={currentSlide === 0}
              aria-label="Previous slide"
            >
              <i className="ri-arrow-left-s-line" aria-hidden="true"></i> Back
            </button>
            <button className="nav-pill nav-pill-next" onClick={goNext} aria-label="Next slide">
              Continue <i className="ri-arrow-right-s-line" aria-hidden="true"></i>
            </button>
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
