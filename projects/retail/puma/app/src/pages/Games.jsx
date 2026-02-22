import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'
import { missionList } from '../data/missions'
import {
  approachScenarios, approachInsights,
  basketCustomerTypes, basketProducts,
} from '../data/game-scenarios'
import './Games.css'

// ── HELPERS ──────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatPrice(n) { return '\u20A6' + n.toLocaleString() }

function getShiftPhase() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'end-of-day'
}

function isBehind(gamesPlayed, shiftPhase) {
  if (shiftPhase === 'morning') return false
  return gamesPlayed === 0
}

const gameDefinitions = [
  { id: 'approach', missionId: 'game-approach', icon: 'ri-chat-voice-line', title: 'The Approach', desc: "Customer walks in. What do you say?", img: '/images/game-approach.jpeg' },
  { id: 'basket', missionId: 'game-basket', icon: 'ri-shopping-basket-2-line', title: 'Build the Basket', desc: 'Add the right products to their basket.', img: '/images/game-basket.jpeg' },
  { id: 'price-defense', missionId: 'game-price-defense', icon: 'ri-price-tag-3-line', title: 'Price Defense', desc: 'Hold margin against price objections.', locked: true },
]

const addonCategoryIcons = {
  addon_socks: 'ri-footprint-line',
  addon_socks_performance: 'ri-run-line',
  addon_headwear: 'ri-baseball-cap-line',
  addon_bag: 'ri-shopping-bag-3-line',
  addon_accessory: 'ri-hand-heart-line',
  addon_bodywear: 'ri-t-shirt-2-line',
}

// ── Root: route by role ─────────────────────
export default function Games() {
  const { profile, userId, role } = useUser()
  const navigate = useNavigate()
  const isManager = role === 'manager'

  return isManager
    ? <ManagerGames profile={profile} navigate={navigate} />
    : <StaffGames profile={profile} userId={userId} />
}

// ── Staff View ──────────────────────────────
function StaffGames({ profile, userId }) {
  const [activeGame, setActiveGame] = useState(null)
  const [bestScores, setBestScores] = useState({})
  const [currentMission, setCurrentMission] = useState(null)
  const initials = profile?.avatar_initials || 'U'

  useEffect(() => {
    if (!userId) return
    loadData()
  }, [userId])

  async function loadData() {
    const [{ data: scores }, { data: dash }] = await Promise.all([
      supabase.from('completions').select('mission_id, score').eq('user_id', userId)
        .in('mission_id', ['game-approach', 'game-basket']).order('score', { ascending: false }),
      supabase.from('manager_dashboard').select('missions_completed').eq('id', userId).single(),
    ])
    if (scores) {
      const best = {}
      scores.forEach(row => {
        if (!best[row.mission_id] || row.score > best[row.mission_id]) best[row.mission_id] = row.score
      })
      setBestScores(best)
    }
    if (dash) {
      const mc = dash.missions_completed || 0
      if (mc < missionList.length) setCurrentMission(missionList[mc])
    }
  }

  function goBack() { setActiveGame(null); loadData() }

  if (activeGame === 'approach') {
    return (
      <div className="game-fullscreen-overlay">
        <Header title="The Approach" initials={initials} />
        <ApproachGame onBack={goBack} userId={userId} bestScore={bestScores['game-approach'] ?? null} />
      </div>
    )
  }
  if (activeGame === 'basket') {
    return (
      <div className="game-fullscreen-overlay">
        <Header title="Build the Basket" initials={initials} />
        <BasketGame onBack={goBack} userId={userId} userName={profile?.full_name} bestScore={bestScores['game-basket'] ?? null} />
      </div>
    )
  }

  return (
    <>
      <Header title="Games" initials={initials} />
      <div className="games-page">
        {currentMission && (
          <div className="games-mission-card">
            <div className="games-mission-label">Your Mission</div>
            <div className="games-mission-name">Mission {currentMission.number}: {currentMission.title}</div>
            <div className="games-mission-desc">These games practise what you're learning this week.</div>
          </div>
        )}

        <div className="games-section-label">Games</div>
        <div className="games-list">
          {gameDefinitions.map(g => (
            <div key={g.id} className={`game-card ${g.locked ? 'game-card-locked' : 'game-card-active'}`} onClick={() => !g.locked && setActiveGame(g.id)}>
              {g.img && (
                <div className="game-card-img">
                  <img src={g.img} alt={g.title} />
                  <div className="game-card-img-overlay" />
                </div>
              )}
              <div className="game-card-content">
                <div className="game-card-icon-wrap"><i className={g.icon}></i></div>
                <div className="game-card-body">
                  <div className="game-card-title">{g.title}</div>
                  <div className="game-card-desc">{g.desc}</div>
                  {!g.locked && bestScores[g.missionId] != null && (
                    <div className="game-card-best"><i className="ri-trophy-line"></i> Best: {bestScores[g.missionId]}%</div>
                  )}
                </div>
                {g.locked
                  ? <div className="game-card-soon">Soon</div>
                  : <div className="game-card-play"><i className="ri-play-fill"></i></div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ── The Approach Game ────────────────────────
function ApproachGame({ onBack, userId, bestScore }) {
  const TOTAL = 8
  const [scenarios, setScenarios] = useState([])
  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [wrongAnswers, setWrongAnswers] = useState([])
  const [phase, setPhase] = useState('play') // play | results
  const [saved, setSaved] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)

  useEffect(() => {
    // Shuffle scenarios AND shuffle each scenario's options so correct answer isn't always A
    const shuffled = shuffle(approachScenarios).slice(0, TOTAL).map(s => ({
      ...s,
      options: shuffle(s.options),
    }))
    setScenarios(shuffled)
  }, [])

  // Auto-save when results show
  useEffect(() => {
    if (phase !== 'results' || !userId) return
    const accuracy = Math.round((correct / TOTAL) * 100)
    supabase.from('completions').insert({ user_id: userId, mission_id: 'game-approach', score: accuracy })
      .then(() => setSaved(true))
  }, [phase, userId, correct])

  if (!scenarios.length) return null

  const current = scenarios[round]
  const accuracy = Math.round((correct / TOTAL) * 100)
  const improved = bestScore !== null && accuracy > bestScore

  function pickOption(idx) {
    if (picked !== null) return
    setPicked(idx)
    const opt = current.options[idx]
    if (opt.correct) {
      setCorrect(c => c + 1)
    } else {
      const correctOpt = current.options.find(o => o.correct)
      setWrongAnswers(wa => [...wa, {
        type: current.type,
        quote: current.quote,
        youSaid: opt.script,
        shouldSay: correctOpt?.script || '',
      }])
    }
  }

  function next() {
    if (round >= TOTAL - 1) {
      setPhase('results')
      return
    }
    setRound(r => r + 1)
    setPicked(null)
  }

  function replay() {
    setScenarios(shuffle(approachScenarios).slice(0, TOTAL).map(s => ({
      ...s,
      options: shuffle(s.options),
    })))
    setRound(0)
    setCorrect(0)
    setPicked(null)
    setWrongAnswers([])
    setPhase('play')
    setSaved(false)
    setReviewOpen(false)
  }

  // ── Results Screen ──
  if (phase === 'results') {
    let emoji, title
    if (accuracy >= 90) { emoji = '\uD83C\uDFC6'; title = 'Approach Master!' }
    else if (accuracy >= 70) { emoji = '\uD83C\uDF1F'; title = 'Great Instincts!' }
    else if (accuracy >= 50) { emoji = '\uD83D\uDC4D'; title = 'Getting There!' }
    else { emoji = '\uD83D\uDCAA'; title = 'Keep Practicing!' }

    // Find most-missed type for key insight
    const typeCounts = {}
    wrongAnswers.forEach(wa => { typeCounts[wa.type] = (typeCounts[wa.type] || 0) + 1 })
    const focusType = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0]
    const insight = approachInsights[focusType] || approachInsights[scenarios[0]?.type] || approachInsights['GUIDED BUYER']

    return (
      <div className="game-container">
        <div className="approach-results">
          <div className="approach-results-emoji">{emoji}</div>
          <div className="approach-results-title">{title}</div>

          <div className="approach-results-stats">
            <div className="approach-stat-row">
              <span className="approach-stat-label">Correct Approaches</span>
              <span className="approach-stat-value">{correct}/{TOTAL}</span>
            </div>
            <div className="approach-stat-row">
              <span className="approach-stat-label">Accuracy</span>
              <span className="approach-stat-value">{accuracy}%</span>
            </div>
          </div>

          {improved && <div className="game-result-improve">\u2191 from {bestScore}% best</div>}
          {bestScore !== null && !improved && <div className="game-result-prev">Best: {bestScore}%</div>}

          <div className="approach-insight-card">
            <div className="approach-insight-title">Key Insight</div>
            <div className="approach-insight-text">{insight}</div>
          </div>

          {wrongAnswers.length > 0 && (
            <div className={`approach-review ${reviewOpen ? '' : 'collapsed'}`}>
              <div className="approach-review-header" onClick={() => setReviewOpen(o => !o)}>
                <span>Review Your Mistakes ({wrongAnswers.length})</span>
                <span className="approach-review-arrow">{reviewOpen ? '\u25BC' : '\u25B6'}</span>
              </div>
              {reviewOpen && (
                <div className="approach-review-list">
                  {wrongAnswers.map((wa, i) => (
                    <div key={i} className="approach-review-item">
                      <div className="approach-review-type">{wa.type}</div>
                      <div className="approach-review-quote">"{wa.quote}"</div>
                      <div className="approach-review-you">You: "{wa.youSaid.substring(0, 60)}..."</div>
                      <div className="approach-review-better">Better: "{wa.shouldSay.substring(0, 60)}..."</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {saved && <div className="game-result-autosaved">\u2713 Saved</div>}
          <div className="approach-results-actions">
            <button className="game-next-btn" onClick={replay}>Play Again</button>
            <button className="game-back-btn-action" onClick={onBack}>\u2190 Back to Games</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Play Screen ──
  return (
    <div className="game-container">
      <div className="game-play">
        <div className="game-back-header" onClick={onBack}>
          <i className="ri-arrow-left-s-line"></i>
          <span>Back to Games</span>
        </div>

        {/* Progress strip */}
        <div className="approach-progress-strip">
          <div className="approach-progress-bar">
            <div className="approach-progress-fill" style={{ width: `${(round / TOTAL) * 100}%` }} />
          </div>
          <div className="approach-progress-text">Scenario {round + 1} of {TOTAL}</div>
        </div>

        {/* Scenario card */}
        <div className="approach-scenario-card">
          <div className="approach-customer-badge">{current.type}</div>
          <div className="approach-scenario-context">{current.context}</div>
          <div className="approach-customer-quote">{current.quote}</div>
          <div className="approach-question-prompt">What do you say?</div>
        </div>

        {/* Options */}
        <div className="approach-options">
          {current.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i)
            let cls = 'approach-option'
            if (picked !== null) {
              if (i === picked && opt.correct) cls += ' correct'
              else if (i === picked && !opt.correct) cls += ' wrong'
              else if (opt.correct) cls += ' was-correct'
            }
            return (
              <div key={i} className={cls} onClick={() => pickOption(i)}>
                <div className="approach-option-badge"></div>
                <div className="approach-option-content">
                  <div className={`approach-option-letter ${picked !== null && (i === picked || opt.correct) ? (opt.correct ? 'letter-correct' : 'letter-wrong') : ''}`}>{letter}</div>
                  <div className="approach-option-text">
                    <div className="approach-option-script">"{opt.script}"</div>
                    {picked !== null && (i === picked || opt.correct) && (
                      <div className={`approach-option-explanation ${opt.correct ? 'explanation-good' : 'explanation-bad'}`}>{opt.explanation}</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {picked !== null && (
          <button className="game-next-btn" onClick={next}>
            {round >= TOTAL - 1 ? 'See Results' : 'Next Scenario \u2192'}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Build the Basket Game ────────────────────
function BasketGame({ onBack, userId, userName, bestScore }) {
  const TOTAL = 5
  const [scenarios, setScenarios] = useState([])
  const [round, setRound] = useState(0)
  const [selectedAddons, setSelectedAddons] = useState(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [phase, setPhase] = useState('play')
  const [saved, setSaved] = useState(false)

  // Cumulative stats
  const [totalScore, setTotalScore] = useState(0)
  const [totalValidAddons, setTotalValidAddons] = useState(0)
  const [totalSelectedValid, setTotalSelectedValid] = useState(0)
  const [totalBasketValue, setTotalBasketValue] = useState(0)
  const [totalMainValue, setTotalMainValue] = useState(0)
  const [roundFeedback, setRoundFeedback] = useState(null)

  useEffect(() => {
    const generated = []
    const typeKeys = Object.keys(basketCustomerTypes)
    for (let i = 0; i < TOTAL; i++) {
      generated.push(generateBasketScenario(typeKeys))
    }
    setScenarios(generated)
  }, [])

  // Auto-save when results show
  useEffect(() => {
    if (phase !== 'results' || !userId) return
    const accuracy = totalValidAddons > 0 ? Math.round((totalSelectedValid / totalValidAddons) * 100) : 0
    supabase.from('completions').insert({ user_id: userId, mission_id: 'game-basket', score: accuracy })
      .then(() => setSaved(true))
  }, [phase, userId, totalSelectedValid, totalValidAddons])

  function generateBasketScenario(typeKeys) {
    const typeKey = typeKeys[Math.floor(Math.random() * typeKeys.length)]
    const type = basketCustomerTypes[typeKey]
    const quote = type.quotes[Math.floor(Math.random() * type.quotes.length)]

    const validMain = basketProducts.main.filter(p =>
      type.mainCategories.some(cat => p.category.includes(cat.replace('main_', '')))
    )
    const mainProduct = validMain.length > 0
      ? validMain[Math.floor(Math.random() * validMain.length)]
      : basketProducts.main[Math.floor(Math.random() * basketProducts.main.length)]

    const validAddonProducts = basketProducts.addons.filter(p => type.validAddons.includes(p.category))
    const invalidAddonProducts = basketProducts.addons.filter(p =>
      type.invalidAddons.includes(p.category) || (!type.validAddons.includes(p.category) && !type.invalidAddons.includes(p.category))
    )

    const addons = []
    const shuffledValid = shuffle(validAddonProducts)
    for (let i = 0; i < Math.min(2, shuffledValid.length); i++) {
      addons.push({ ...shuffledValid[i], valid: true, reason: `Good match for ${type.name}` })
    }
    if (shuffledValid.length > 2) {
      addons.push({ ...shuffledValid[2], optional: true, reason: 'Optional — nice to have' })
    }
    const shuffledInvalid = shuffle(invalidAddonProducts)
    if (shuffledInvalid.length > 0) {
      addons.push({ ...shuffledInvalid[0], valid: false, reason: `Wrong for ${type.name}` })
    }

    return { customerType: type.name, customerSays: quote, mainProduct, addons: shuffle(addons) }
  }

  if (!scenarios.length) return null

  const current = scenarios[round]
  const addonsPrice = [...selectedAddons].reduce((sum, i) => sum + (current?.addons[i]?.price || 0), 0)
  const basketTotal = (current?.mainProduct.price || 0) + addonsPrice
  const addonRate = addonsPrice > 0 ? Math.round((addonsPrice / current.mainProduct.price) * 100) : 0

  function toggleAddon(idx) {
    if (submitted) return
    setSelectedAddons(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  function submitBasket() {
    if (submitted) {
      // Advance
      if (round >= TOTAL - 1) { setPhase('results'); return }
      setRound(r => r + 1)
      setSelectedAddons(new Set())
      setSubmitted(false)
      setRoundFeedback(null)
      return
    }

    setSubmitted(true)
    setTotalMainValue(v => v + current.mainProduct.price)

    let correctCount = 0, wrongCount = 0, missedCount = 0, roundAddonsValue = 0
    let validThisRound = 0, selectedValidThisRound = 0

    current.addons.forEach((addon, i) => {
      const wasSelected = selectedAddons.has(i)
      if (addon.valid) {
        validThisRound++
        if (wasSelected) { correctCount++; selectedValidThisRound++; roundAddonsValue += addon.price }
        else missedCount++
      } else if (addon.optional) {
        if (wasSelected) roundAddonsValue += addon.price
      } else {
        if (wasSelected) wrongCount++
      }
    })

    setTotalValidAddons(v => v + validThisRound)
    setTotalSelectedValid(v => v + selectedValidThisRound)
    setTotalBasketValue(v => v + roundAddonsValue)

    const roundScore = Math.max(0, (correctCount * 100) - (wrongCount * 50))
    setTotalScore(s => s + roundScore)
    setRoundFeedback({ correctCount, wrongCount, missedCount })
  }

  function replay() {
    const typeKeys = Object.keys(basketCustomerTypes)
    const generated = []
    for (let i = 0; i < TOTAL; i++) generated.push(generateBasketScenario(typeKeys))
    setScenarios(generated)
    setRound(0)
    setSelectedAddons(new Set())
    setSubmitted(false)
    setPhase('play')
    setSaved(false)
    setTotalScore(0)
    setTotalValidAddons(0)
    setTotalSelectedValid(0)
    setTotalBasketValue(0)
    setTotalMainValue(0)
    setRoundFeedback(null)
  }

  const finalAccuracy = totalValidAddons > 0 ? Math.round((totalSelectedValid / totalValidAddons) * 100) : 0
  const avgRate = totalMainValue > 0 ? Math.round((totalBasketValue / totalMainValue) * 100) : 0
  const improved = bestScore !== null && finalAccuracy > bestScore

  // ── Results Screen ──
  if (phase === 'results') {
    let emoji, title, subtitle
    if (finalAccuracy >= 80 && avgRate >= 12) { emoji = '\uD83C\uDFC6'; title = 'Basket Builder Pro!'; subtitle = "You know how to read customers" }
    else if (finalAccuracy >= 60) { emoji = '\uD83C\uDF1F'; title = 'Great Progress!'; subtitle = 'Keep practicing the customer types' }
    else { emoji = '\uD83D\uDCAA'; title = 'Keep Learning!'; subtitle = 'Review the customer types and try again' }

    return (
      <div className="game-container">
        <div className="basket-results">
          <div className="basket-results-emoji">{emoji}</div>
          <div className="basket-results-title">{title}</div>
          <div className="basket-results-subtitle">{subtitle}</div>

          <div className="basket-results-stats">
            <div className="approach-stat-row">
              <span className="approach-stat-label">Correct Add-ons</span>
              <span className="approach-stat-value">{totalSelectedValid}/{totalValidAddons}</span>
            </div>
            <div className="approach-stat-row">
              <span className="approach-stat-label">Accuracy</span>
              <span className="approach-stat-value">{finalAccuracy}%</span>
            </div>
            <div className="approach-stat-row">
              <span className="approach-stat-label">Avg Add-on Rate</span>
              <span className="approach-stat-value">{avgRate}%</span>
            </div>
          </div>

          {improved && <div className="game-result-improve">{'\u2191'} from {bestScore}% best</div>}
          {bestScore !== null && !improved && <div className="game-result-prev">Best: {bestScore}%</div>}
          {saved && <div className="game-result-autosaved">{'\u2713'} Saved</div>}

          <div className="basket-results-actions">
            <button className="game-next-btn" onClick={replay}>Try Again</button>
            <button className="game-back-btn-action" onClick={onBack}>{'\u2190'} Back to Games</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Play Screen ──
  return (
    <div className="game-container">
      <div className="game-play">
        <div className="game-back-header" onClick={onBack}>
          <i className="ri-arrow-left-s-line"></i>
          <span>Back to Games</span>
        </div>

        {/* Progress */}
        <div className="approach-progress-strip">
          <div className="approach-progress-bar">
            <div className="approach-progress-fill" style={{ width: `${(round / TOTAL) * 100}%` }} />
          </div>
          <div className="approach-progress-text">Customer {round + 1} of {TOTAL}</div>
        </div>

        {/* Scenario card */}
        <div className="basket-scenario-card">
          <div className="approach-customer-badge">{current.customerType}</div>
          <div className="approach-customer-quote">{current.customerSays}</div>
          <div className="basket-main-product">
            <div className="basket-main-info">
              <div className="basket-main-label">They're buying</div>
              <div className="basket-main-name">{current.mainProduct.name}</div>
            </div>
            <div className="basket-main-price">{formatPrice(current.mainProduct.price)}</div>
          </div>
        </div>

        {/* Cash register strip */}
        <div className="basket-register">
          {!submitted ? (
            <div className="basket-register-live">
              <div className="basket-register-col">
                <div className="basket-register-label">Basket</div>
                <div className="basket-register-value">{formatPrice(basketTotal)}</div>
              </div>
              <div className="basket-register-col">
                <div className="basket-register-label">Add-on Rate</div>
                <div className={`basket-register-value ${addonRate === 0 ? 'rate-low' : addonRate < 10 ? 'rate-med' : 'rate-high'}`}>{addonRate}%</div>
              </div>
            </div>
          ) : (
            <div className="basket-register-result">
              <div className="basket-register-col">
                <div className="basket-register-label">Correct</div>
                <div className="basket-register-value rate-high">{roundFeedback?.correctCount || 0}</div>
              </div>
              <div className="basket-register-col">
                <div className="basket-register-label">Wrong</div>
                <div className="basket-register-value rate-low">{roundFeedback?.wrongCount || 0}</div>
              </div>
              <div className="basket-register-col">
                <div className="basket-register-label">Missed</div>
                <div className="basket-register-value rate-missed">{roundFeedback?.missedCount || 0}</div>
              </div>
            </div>
          )}
        </div>

        {/* Add-ons */}
        <div className="basket-addons-header">What else should they get?</div>
        <div className="basket-addons-list">
          {current.addons.map((addon, i) => {
            const isSelected = selectedAddons.has(i)
            let cls = 'basket-addon-item'
            if (isSelected && !submitted) cls += ' selected'
            if (submitted) {
              if (addon.valid && isSelected) cls += ' addon-correct'
              else if (addon.valid && !isSelected) cls += ' addon-missed'
              else if (!addon.valid && !addon.optional && isSelected) cls += ' addon-wrong'
              else if (addon.optional) cls += ' addon-optional'
            }
            return (
              <div key={i} className={cls} onClick={() => toggleAddon(i)}>
                <div className="basket-addon-thumb"><i className={addonCategoryIcons[addon.category] || 'ri-box-3-line'}></i></div>
                <div className="basket-addon-info">
                  <div className="basket-addon-name">{addon.name}</div>
                  {submitted && <div className={`basket-addon-reason ${addon.valid ? 'reason-good' : addon.optional ? 'reason-neutral' : 'reason-bad'}`}>{addon.reason}</div>}
                </div>
                <div className="basket-addon-price">{formatPrice(addon.price)}</div>
                {submitted && (addon.valid || (!addon.optional && isSelected) || (!addon.valid && !addon.optional && !isSelected && false)) && (
                  <div className={`basket-addon-badge ${addon.valid && isSelected ? 'badge-correct' : addon.valid && !isSelected ? 'badge-missed' : 'badge-wrong'}`}>
                    {addon.valid && isSelected ? '\u2713' : addon.valid ? '!' : '\u2717'}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button className="game-next-btn basket-submit-btn" onClick={submitBasket}>
          {submitted
            ? (round >= TOTAL - 1 ? 'See Results' : 'Next Customer \u2192')
            : 'Check My Basket'
          }
        </button>
      </div>
    </div>
  )
}

// ── Manager View ────────────────────────────
function ManagerGames({ profile, navigate }) {
  const [teamData, setTeamData] = useState([])
  const [loading, setLoading] = useState(true)
  const shiftPhase = getShiftPhase()
  const initials = profile?.avatar_initials || 'M'

  useEffect(() => {
    fetchTeamData()
    const channel = supabase
      .channel('team-games')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'completions' }, () => fetchTeamData())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchTeamData() {
    const [{ data: staff }, { data: allGameScores }] = await Promise.all([
      supabase.from('manager_dashboard').select('*'),
      supabase.from('completions').select('user_id, mission_id, score, created_at')
        .in('mission_id', ['game-approach', 'game-basket']),
    ])
    if (!staff) { setLoading(false); return }

    const today = new Date().toISOString().split('T')[0]
    const team = staff.map(s => {
      const userGames = (allGameScores || []).filter(c => c.user_id === s.id)
      const todayGames = userGames.filter(c => c.created_at?.startsWith(today))
      const approachScores = userGames.filter(c => c.mission_id === 'game-approach').map(c => c.score)
      const basketScores = userGames.filter(c => c.mission_id === 'game-basket').map(c => c.score)
      const todayGameIds = new Set(todayGames.map(c => c.mission_id))

      return {
        ...s,
        bestApproach: approachScores.length > 0 ? Math.max(...approachScores) : null,
        bestBasket: basketScores.length > 0 ? Math.max(...basketScores) : null,
        playedToday: todayGameIds.size,
        totalGames: 2,
      }
    })

    setTeamData(team)
    setLoading(false)
  }

  return (
    <>
      <Header title="Games" initials={initials} />
      <div className="games-page">
        <div className="games-mgr-header">
          <div className="games-mgr-title">Team Games</div>
          <div className="games-mgr-total">{teamData.length} staff {'\u00B7'} Practice through play</div>
        </div>

        {loading && <div className="games-loading">Loading team data\u2026</div>}

        {/* Team Performance Chart */}
        {!loading && teamData.length > 0 && (
          <div className="games-chart-card">
            <div className="games-chart-title">Team Scores</div>
            <div className="games-chart">
              {teamData.map(s => {
                const avgScore = [s.bestApproach, s.bestBasket].filter(v => v != null)
                const avg = avgScore.length > 0 ? Math.round(avgScore.reduce((a, b) => a + b, 0) / avgScore.length) : 0
                const firstName = (s.full_name || '?').split(' ')[0]
                return (
                  <div key={s.id} className="games-chart-col" onClick={() => navigate(`/staff/${s.id}`)}>
                    <div className="games-chart-val">{avg > 0 ? `${avg}%` : '\u2014'}</div>
                    <div className="games-chart-bar-track">
                      <div
                        className={`games-chart-bar-fill ${avg >= 80 ? 'bar-high' : avg >= 50 ? 'bar-mid' : 'bar-low'}`}
                        style={{ height: `${avg}%` }}
                      />
                    </div>
                    <div className="games-chart-name">{firstName}</div>
                  </div>
                )
              })}
            </div>
            <div className="games-chart-legend">
              <span className="games-chart-legend-item"><span className="chart-dot chart-dot-high" /> 80%+ On Track</span>
              <span className="games-chart-legend-item"><span className="chart-dot chart-dot-mid" /> 50-79%</span>
              <span className="games-chart-legend-item"><span className="chart-dot chart-dot-low" /> &lt;50% Needs Help</span>
            </div>
          </div>
        )}

        <div className="games-team-list">
          {teamData.map(s => {
            const behind = isBehind(s.playedToday, shiftPhase)
            const allDone = s.playedToday >= s.totalGames
            const mc = s.missions_completed || 0
            const missionName = mc < missionList.length ? `M${mc + 1}: ${missionList[mc].title}` : 'Certified'

            return (
              <div key={s.id}
                className={`games-staff-card ${behind ? 'alert' : allDone ? 'complete' : ''}`}
                onClick={() => navigate(`/staff/${s.id}`)}
              >
                <div className="games-staff-top">
                  <div className={`games-staff-avatar ${behind ? 'avatar-alert' : allDone ? 'avatar-complete' : 'avatar-ok'}`}>
                    {s.avatar_initials || '?'}
                  </div>
                  <div className="games-staff-info">
                    <div className="games-staff-name">{s.full_name}</div>
                    <div className="games-staff-mission">{missionName}</div>
                  </div>
                  <div className="games-staff-flag">
                    {behind && <><div className="games-dot dot-red" /><span className="games-behind">Behind</span></>}
                    {allDone && <div className="games-dot dot-green" />}
                  </div>
                </div>
                <div className="games-staff-scores">
                  <div className="games-score-pill">
                    <span className="games-score-label">Approach</span>
                    <span className="games-score-val">{s.bestApproach != null ? `${s.bestApproach}%` : '\u2014'}</span>
                  </div>
                  <div className="games-score-pill">
                    <span className="games-score-label">Basket</span>
                    <span className="games-score-val">{s.bestBasket != null ? `${s.bestBasket}%` : '\u2014'}</span>
                  </div>
                </div>
                <div className="games-staff-played">
                  <span className={`games-played-count ${behind ? 'count-alert' : allDone ? 'count-complete' : ''}`}>
                    {s.playedToday}/{s.totalGames}
                  </span>
                  <span className="games-played-label">played today</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
