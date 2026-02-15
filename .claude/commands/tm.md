# /tm — Task Manager

Native task management for Claude Code. Replaces external TaskMaster CLI.

## Usage

```
/tm                 Show dashboard + next task
/tm list            List all tasks
/tm next            Show next task to work on
/tm add <idea>      Add new task (I'll expand it)
/tm expand <id>     Break down task into subtasks
/tm done <id>       Mark task complete
/tm show <id>       Show task details
```

## Instructions

When user invokes /tm, read the tasks file and respond accordingly:

**Tasks file:** `/projects/tasks/tasks.json`

### For `/tm` or `/tm next`:
1. Read tasks.json
2. Find highest-priority pending task with no unmet dependencies
3. Display as ASCII dashboard:

```
╭────────────────────────────────────────────────────────╮
│  TASK DASHBOARD                                        │
│  Pending: X  |  Done: Y  |  Total: Z                  │
╰────────────────────────────────────────────────────────╯

╭────────────────────────────────────────────────────────╮
│  NEXT TASK: #ID - Title                               │
│  Priority: high  |  Project: NAME                     │
│  Description: ...                                      │
╰────────────────────────────────────────────────────────╯
```

### For `/tm list`:
Show all tasks in table format:
```
┌────┬─────────────────────┬──────────┬────────┬─────────┐
│ ID │ Title               │ Status   │ Prior  │ Project │
├────┼─────────────────────┼──────────┼────────┼─────────┤
│ 1  │ Clean CLAUDE.md     │ pending  │ high   │ INFRA   │
└────┴─────────────────────┴──────────┴────────┴─────────┘
```

### For `/tm add <idea>`:
1. Generate task from the idea
2. Ask for priority (high/medium/low) and project tag
3. Add to tasks.json with next available ID
4. Confirm with ASCII

### For `/tm expand <id>`:
1. Read the task
2. Generate 3-5 subtasks that break down the work
3. Show subtasks for user approval before saving
4. Display assumptions so user can correct

### For `/tm done <id>`:
1. Set task status to "done"
2. Check if this unblocks any dependent tasks
3. Show updated dashboard

### For `/tm show <id>`:
Display full task details including subtasks

## Priority Order
1. High priority, no dependencies → work on first
2. High priority, dependencies met → work on next
3. Medium priority, no dependencies
4. Low priority

## ASCII Style
Use box-drawing characters: ╭ ╮ ╰ ╯ │ ─ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼
