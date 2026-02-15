-- ═══════════════════════════════════════════════════════════
-- PUMA TRAINING APP — Supabase Database Schema
-- Translated from DATABASE-ASCII.md (user-approved design)
-- Date: 2026-02-14
--
-- MODULARITY: Each table is independent. You can:
--   + Add a game without touching missions
--   + Add a reward without touching games
--   + Change daily review questions without touching anything else
--   + Import new products without changing the game
--   + Add a module without rebuilding the app
--   + Reskin the UI without touching any of this
-- ═══════════════════════════════════════════════════════════


-- ─── THE PEOPLE ─────────────────────────────────────────────

-- Box 1: Store
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Puma Lekki"
  location TEXT,                         -- "Lekki, Lagos"
  status TEXT DEFAULT 'active',          -- active / paused
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Box 2: User
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  name TEXT NOT NULL,                    -- "Peter"
  email TEXT UNIQUE,
  role TEXT NOT NULL,                    -- sales / manager / admin
  phone TEXT,                            -- mobile number
  whatsapp TEXT,                         -- if different from phone
  telegram TEXT,                         -- @handle (optional)
  streak INTEGER DEFAULT 0,             -- consecutive days active
  last_active TIMESTAMPTZ,
  status TEXT DEFAULT 'active',          -- active / stale (auto-calculated)
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─── THE CONTENT ────────────────────────────────────────────

-- Box 3: Module
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Module 1"
  description TEXT,                      -- "Retail Sales Foundations"
  sort_order INTEGER NOT NULL,           -- 1, 2, 3...
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Box 4: Mission (= Lesson)
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id),
  name TEXT NOT NULL,                    -- "The 5-30-60 Rule"
  sort_order INTEGER NOT NULL,           -- 1-6 within module
  content_md TEXT,                       -- lesson text (markdown)
  visual_key TEXT,                       -- pointer to illustration
  read_time TEXT,                        -- "2 min"
  practice_checklist JSONB,              -- ["Greet in 5 sec", "Approach 80%+"]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Box 5: Quiz
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES missions(id),
  pass_threshold INTEGER DEFAULT 80,     -- percentage to pass
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Box 6: Question
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  sort_order INTEGER NOT NULL,
  text TEXT NOT NULL,                    -- "Customer says 'Let me think.' First move?"
  options JSONB NOT NULL,                -- ["Offer discount", "Ask what's making them hesitate", ...]
  correct_answer INTEGER NOT NULL,       -- index of correct option (0-based)
  explanation TEXT,                       -- "Probe before offering solutions..."
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─── THE GAMES (modular — add new games anytime) ───────────

-- Box 7: Game
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Build Your Basket"
  type TEXT NOT NULL,                    -- basket / scenario / tbd
  description TEXT,                      -- what the game is
  principle TEXT,                        -- what skill it teaches
  config JSONB,                          -- game-specific settings
  related_missions JSONB,                -- [mission_id, mission_id] — which missions this reinforces
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Box 8: Product Catalog (for Build Your Basket — uses real inventory)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  name TEXT NOT NULL,                    -- "Puma RS-X"
  category TEXT,                         -- "Running Shoes"
  price INTEGER NOT NULL,                -- price in Naira (₦45000)
  related_products JSONB,                -- ["Socks", "Insoles", "Running shorts"]
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─── REWARDS (modular — add new reward types anytime) ──────

-- Box 9: Reward (the reward types available)
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Module 1 Cheat Sheet"
  type TEXT NOT NULL,                    -- cheat_sheet / badge / certificate / custom
  trigger TEXT NOT NULL,                 -- module_complete / quiz_perfect / game_high / streak_7 / manager_given
  content TEXT,                          -- cheat sheet markdown, or badge description
  module_id UUID REFERENCES modules(id), -- if module-specific (NULL if not)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Box 15: User Reward (who earned what)
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  reward_id UUID REFERENCES rewards(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  given_by TEXT DEFAULT 'system'         -- "system" or manager's user_id
);


-- ─── TRACKING ACTIVITY ─────────────────────────────────────

-- Box 10: Progress (per user per mission)
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  mission_id UUID REFERENCES missions(id),
  status TEXT DEFAULT 'not_started',     -- not_started / in_progress / done
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, mission_id)            -- one row per user per mission
);

-- Box 11: Quiz Attempt (multiple attempts allowed, best score counts)
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  quiz_id UUID REFERENCES quizzes(id),
  score INTEGER NOT NULL,                -- e.g. 4 (out of 5)
  total INTEGER NOT NULL,                -- e.g. 5
  passed BOOLEAN NOT NULL,               -- true if score/total >= threshold
  answers JSONB,                         -- [1, 0, 2, 1, 3] — which option picked
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Box 12: Game Score (multiple plays, show highest + latest)
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  game_id UUID REFERENCES games(id),
  score INTEGER NOT NULL,
  details JSONB,                         -- game-specific data (items chosen, basket total, etc.)
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Box 13: Daily Review (quick end-of-shift check-in)
CREATE TABLE daily_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  review_date DATE NOT NULL,             -- the day being reviewed
  day_rating INTEGER NOT NULL,           -- 1-5 stars
  confidence INTEGER NOT NULL,           -- 1-5 (how confident using what you learned)
  highlight TEXT,                         -- optional quick note
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, review_date)           -- one review per user per day
);

-- Box 14: Practice Log
CREATE TABLE practice_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  mission_id UUID REFERENCES missions(id),
  customers_count INTEGER,               -- how many customers practiced on
  note TEXT,                             -- "Asked 4 Qs to 3 customers..."
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Box 16: Encouragement (manager → staff)
CREATE TABLE encouragements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  trigger TEXT,                          -- quiz_passed / game_high / module_complete / custom
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);


-- ─── ROW LEVEL SECURITY ────────────────────────────────────
-- (so users can only see their own data, managers see their store)

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE encouragements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- Sales staff: see only their own data
CREATE POLICY "Staff see own progress" ON progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff see own quiz attempts" ON quiz_attempts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff see own game scores" ON game_scores
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff see own daily reviews" ON daily_reviews
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff see own rewards" ON user_rewards
  FOR SELECT USING (user_id = auth.uid());

-- Managers: see all data for their store
-- (implemented via store_id join — manager's store_id must match user's store_id)

-- Content tables are readable by all authenticated users
-- (modules, missions, quizzes, questions, games, products, rewards)


-- ═══════════════════════════════════════════════════════════
-- MODULARITY NOTES
-- ═══════════════════════════════════════════════════════════
--
-- ADD A GAME:       INSERT INTO games (...) — nothing else changes
-- ADD A REWARD:     INSERT INTO rewards (...) — nothing else changes
-- ADD A MODULE:     INSERT INTO modules (...) + missions + quizzes + questions
-- ADD PRODUCTS:     INSERT INTO products (...) — CSV import, nothing else changes
-- CHANGE DAILY Q:   The questions (day_rating, confidence) are columns.
--                   To make them configurable, create a daily_review_config table.
--                   For now, hardcoded is fine — change later if needed.
-- RESKIN UI:        None of this changes. UI reads from these tables.
--                   Swap CSS/components, data stays the same.
-- ═══════════════════════════════════════════════════════════
