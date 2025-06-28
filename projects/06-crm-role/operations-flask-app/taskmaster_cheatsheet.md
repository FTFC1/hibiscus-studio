# Task Master Cheatsheet

This is your quick-reference guide for managing this project with the `task-master` command-line interface (CLI).

## 🔹 Core Workflow Commands

**See what to do next**
`task-master next`
*Why: Shows the highest-priority, unblocked task you should work on.*

**List all tasks**
`task-master list --with-subtasks`
*Why: Gives a full overview of the project, including subtasks.*

**View a specific task's details**
`task-master show <task_id>`
*Example: `task-master show 14.1`*
*Why: Shows the full description, details, and requirements for one task.*

**Mark a task as done**
`task-master set-status --id <task_id> --status done`
*Example: `task-master set-status --id 14.1 --status done`*
*Why: Updates the project plan and unblocks dependent tasks.*


## 🔹 Planning & Structuring Commands

**Add a new task from an idea (AI)**
`task-master add-task --prompt "<your idea here>"`
*Why: Quickly capture new requirements without losing focus.*

**Add a subtask to break down work**
`task-master add-subtask --id <parent_id> --title "<subtask title>"`
*Example: `task-master add-subtask --id 14 --title "Initialize the database"`*
*Why: Keep tasks small and manageable (aim for < 3/10 difficulty).*

**Break down a complex task with AI**
`task-master expand --id <task_id>`
*Why: Automatically generate subtasks for a large or complex task.*


## 🔹 Updating & Logging

**Add notes to a subtask (AI)**
`task-master update-subtask --id <subtask_id> --prompt "<your notes here>"`
*Why: Log implementation details, decisions, or roadblocks as you work.*

**Update a task with new info (AI)**
`task-master update-task --id <task_id> --prompt "<new requirements>"`
*Why: Adapt the plan when requirements change.*

---
*Remember: You can tell me these commands in plain English, and I'll execute them for you.* 