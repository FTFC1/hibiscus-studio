import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'
import './Activity.css'

const medals = { 1: '\u{1F947}', 2: '\u{1F948}', 3: '\u{1F949}' }

export default function Activity() {
  const { profile } = useUser()
  const [leaderboard, setLeaderboard] = useState([])
  const [buzzItems, setBuzzItems] = useState([])

  useEffect(() => {
    loadActivity()
  }, [])

  async function loadActivity() {
    // Build leaderboard from completions
    const { data: allCompletions } = await supabase
      .from('completions')
      .select('user_id, score, profiles(full_name, avatar_initials)')

    if (allCompletions) {
      const byUser = {}
      allCompletions.forEach(c => {
        if (!byUser[c.user_id]) {
          byUser[c.user_id] = {
            userId: c.user_id,
            name: c.profiles?.full_name || 'Unknown',
            initials: c.profiles?.avatar_initials || '??',
            totalScore: 0,
            count: 0
          }
        }
        byUser[c.user_id].totalScore += c.score
        byUser[c.user_id].count += 1
      })

      const sorted = Object.values(byUser)
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((u, i) => ({
          rank: i + 1,
          name: u.name,
          xp: u.totalScore,
          isYou: u.userId === profile?.id
        }))

      setLeaderboard(sorted)
    }

    // Recent activity buzz
    const { data: recent } = await supabase
      .from('completions')
      .select('mission_id, score, completed_at, is_demo, profiles(full_name, avatar_initials)')
      .order('completed_at', { ascending: false })
      .limit(5)

    if (recent) {
      setBuzzItems(recent.map(r => ({
        initial: r.profiles?.avatar_initials?.[0] || '?',
        name: r.profiles?.full_name || 'Unknown',
        action: `scored ${r.score}% on ${r.mission_id}`,
        time: getTimeAgo(r.completed_at),
        isDemo: r.is_demo
      })))
    }
  }

  function getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const initials = profile?.avatar_initials || 'U'

  return (
    <>
      <Header title="Activity" initials={initials} />

      <div className="activity-page">
        {/* Leaderboard */}
        <div className="leaderboard">
          <div className="leaderboard-title">Weekly Leaderboard</div>
          {leaderboard.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-on-dark-sub)', fontSize: 13 }}>
              Complete missions to appear on the leaderboard
            </div>
          )}
          {leaderboard.map((p) => (
            <div
              key={p.rank}
              className={'lb-row' + (p.isYou ? ' lb-row-you' : '')}
            >
              <span
                className={
                  'lb-rank' +
                  (p.rank <= 3 ? ' lb-rank-medal' : ' lb-rank-default')
                }
              >
                {medals[p.rank] || p.rank}
              </span>
              <span
                className={'lb-name' + (p.isYou ? ' lb-name-you' : '')}
              >
                {p.isYou ? 'You' : p.name}
              </span>
              <span className="lb-xp">{p.xp} XP</span>
            </div>
          ))}
        </div>

        {/* Team Buzz */}
        <div className="team-buzz">
          <div className="team-buzz-title">
            Team Buzz
            {buzzItems.some(b => b.isDemo) && <span className="demo-pill" style={{ marginLeft: 8 }}>DEMO DATA</span>}
          </div>
          {buzzItems.length === 0 ? (
            <div className="buzz-empty">
              Complete a mission to show up here first
            </div>
          ) : (
            buzzItems.map((item, i) => (
              <div className="buzz-item" key={i}>
                <div className="buzz-avatar">{item.initial}</div>
                <div className="buzz-content">
                  <div className="buzz-text">
                    <strong>{item.name}</strong> {item.action}
                  </div>
                  <div className="buzz-time">{item.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
