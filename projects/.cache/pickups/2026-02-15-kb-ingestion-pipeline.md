# Pickup: 2026-02-15-kb-ingestion-pipeline
saved: 2026-02-15T03:40:00
mode: standard
device: laptop

## Context (self-contained)
Built the Knowledge Base Ingestion Pipeline (v5). Took 131 YouTube videos from a private playlist, processed 36 through NotebookLM (Gemini), and designed a funnel architecture to process all 131 into searchable JSON knowledge atoms. Key insight: transcription is FREE (Whisper local), Gemini scores are UNRELIABLE (Claude must re-score), and the playlist categories reveal a data-driven circle of competence (AI Tools 38, Identity 16, Sales 15, Philosophy 13). Research confirmed 131 docs is too small to optimize — just batch process them all. Final pipeline: Whisper → Sonnet agents (flatten) → Opus (connections). No Batch API needed — use Team Agents within Claude Code to process in parallel at zero additional cost. Team Agents research running in background.

## Read First
1. /projects/learn/video-kb/INGESTION-PIPELINE-v4.md (3KB) — architecture decision
2. /projects/learn/video-kb/knowledge-atoms/playlist-index.json (33KB) — 131 videos indexed
3. /projects/learn/video-kb/knowledge-atoms/batch-01-notebooklm.json (20KB) — 36 sources
4. /projects/learn/video-kb/knowledge-atoms/research-processing-methods.md (18KB) — processing strategy
5. /projects/.cache/agent-outputs/2026-02-15-team-agents-research.md — Team Agents best practices (if complete)

## Streams
- KB Ingestion Pipeline [DONE] — architecture decided, data saved, research complete
- Team Agents Research [ACTIVE] — background agent researching Anthropic docs on efficient team usage
- Transcript Processing [NOT STARTED] — next: Whisper 131 videos → Sonnet agents flatten → Opus connections

## Next
1. Check Team Agents research output when ready
2. Whisper-transcribe 5 test videos locally to confirm quality + speed
3. Spawn Sonnet agent team to flatten test batch into JSON atoms
4. Run Opus over batch to find connections + prescriptive feed

## Decided (don't re-litigate)
- Pipeline v5: Whisper (free) → Sonnet agents (flatten) → Opus (connections)
- NotebookLM = pipeline component, not source of truth. Gemini scores unreliable.
- Transcription is FREE (Whisper local). Not a cost constraint.
- No Batch API — use Team Agents within Claude Code environment.
- Single-pass processing wins at 131 docs. Don't over-optimize.
- Categories = data-driven circle of competence, not just organization.
- Interest map should be PRESCRIPTIVE (guide next consumption) not just descriptive.
- Incremental processing. Section by section, not all at once.

## Open (needs human input)
- Which 5 videos to test-transcribe first?
- Skip music/culture videos entirely or include for completeness?
