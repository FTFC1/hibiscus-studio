-- PUMA Practice Logs — daily task persistence
CREATE TABLE IF NOT EXISTS practice_logs (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id text NOT NULL,
  task_idx   integer NOT NULL,
  date       date NOT NULL DEFAULT current_date,
  completed  boolean DEFAULT true,
  checked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, mission_id, task_idx, date)
);

CREATE INDEX IF NOT EXISTS idx_practice_user_date ON practice_logs (user_id, date);
CREATE INDEX IF NOT EXISTS idx_practice_date ON practice_logs (date);

ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_write_own" ON practice_logs
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "manager_read_all" ON practice_logs
  FOR SELECT TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid()) AND role = 'manager'
    )
  );
