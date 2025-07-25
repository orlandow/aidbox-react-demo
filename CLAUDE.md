# CLAUDE.md

This project is a demo application for connecting to an Aidbox instance and showcase a simple patient intake form using ReactJS.

## Aidbox

Aidbox is a FHIR Server by HealthSamurai.

## Intake App

Simple Intake App where we'll manage patients and encounters. Capture vitals and other info on their visit.

## Code

### Stack

- Typescript
- ReactJS
- Tailwind CSS
- Tailwind UI

### Style

- Be concise
- Prefer simple code

## Dev

- Use playwright MCP for UI testing
- Use tmux for launching dev servers without hanging, like: `tmux new-session -d -s dev-server 'npm run dev'` 
- When checking dev server logs using tmux and `tail`, remember that stacktraces can be long so we need to specify at least `-n 50`, maybe longer.
- You can keep the tmux session and the playwright browser open from task to task, you don't have to kill it

## Tasks

We'll use task files to guide development and keep track of current work. We'll always be working on one task file at a time. Tasks live in a `./tasks` folder

- New tasks: `./tasks/todo/<filename>.md`
- In Progress tasks: `./tasks/in-progress/<filename>.md`
- Completed tasks: `./tasks/done/<filename>.md`

Read `./tasks/readme.md` to better understand task management.

When starting a new task, you can read the latest completed tasks for more context.
