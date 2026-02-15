-- SESSION: 2026-01-26 HB Admin Dashboard Fix
-- Log insights, decisions, and patterns to brain schema

-- ITEMS (Nodes)
INSERT INTO items (source, item_type, content, raw_text) VALUES
('session', 'insight', 'Worker Error 1101 means exception thrown - diagnose by wrapping in try-catch and returning error page with stack trace', 'Cloudflare Workers Error 1101 debugging pattern'),
('session', 'decision', 'Use Cloudflare Access (Zero Trust) for admin auth - free up to 50 users, email OTP, enterprise-grade, zero maintenance', 'Security upgrade from simple key-based auth'),
('session', 'insight', 'toISOString() on Invalid Date throws - always guard with isNaN(date.getTime()) check before calling', 'JavaScript Date pitfall'),
('session', 'action', 'Added null date guards to generateBookingCard() - skip bookings with missing/invalid dates instead of crashing', 'HB admin fix'),
('session', 'observation', 'Variables duplicateIds and syncedIds were referenced but never defined - incomplete feature left crash risk', 'Code review finding');

-- Link items to hb-studio project
INSERT INTO item_projects (item_id, project_id)
SELECT i.id, p.id
FROM items i, projects p
WHERE i.source = 'session'
AND i.created_at > datetime('now', '-1 hour')
AND p.name = 'hb-studio';

-- Tag with decision surfaces
-- Item 1 (Error 1101 pattern) -> TOOLING
INSERT INTO item_surfaces (item_id, surface_id, confidence)
SELECT i.id, 7, 0.9 FROM items i
WHERE i.content LIKE '%Worker Error 1101%' AND i.source = 'session';

-- Item 2 (Cloudflare Access) -> TOOLING
INSERT INTO item_surfaces (item_id, surface_id, confidence)
SELECT i.id, 7, 1.0 FROM items i
WHERE i.content LIKE '%Cloudflare Access%' AND i.source = 'session';

-- Tag with viewpoint classes
-- Item 5 (undefined variables) -> Silent Failure
INSERT INTO item_viewpoints (item_id, viewpoint_id, confidence)
SELECT i.id, 5, 0.9 FROM items i
WHERE i.content LIKE '%never defined%' AND i.source = 'session';

-- Item 3 (toISOString pitfall) -> Hidden Constraint
INSERT INTO item_viewpoints (item_id, viewpoint_id, confidence)
SELECT i.id, 4, 0.85 FROM items i
WHERE i.content LIKE '%toISOString%' AND i.source = 'session';

-- Add skill used this session
INSERT OR IGNORE INTO skills (name, description) VALUES
('worker-debugging', 'Cloudflare Worker error diagnosis via try-catch injection and error page rendering');

-- Link skill to project
INSERT OR IGNORE INTO project_skills (project_id, skill_id, relationship)
SELECT p.id, s.id, 'uses'
FROM projects p, skills s
WHERE p.name = 'hb-studio' AND s.name = 'worker-debugging';
