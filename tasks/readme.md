# Task Management

This directory contains task files organized by status.

## Structure

- `todo/` - Tasks that need to be done
- `in-progress/` - Tasks currently being worked on
- `done/` - Completed tasks

## Task File Format

Each task is a markdown file with the naming convention: `NNN-task-description.md`

Example: `001-implement-parser.md`

## Task Template

```markdown
# Task: [Title]

## Description
What needs to be done

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Notes
Any additional context or dependencies
```

## Workflow

1. Create new tasks in `todo/`
   - If the task already exists with the description or name, add the rest of the sections
2. Move to `in-progress/` when starting work
3. Add completion notes and move to `done/` when completed

## Task Completion

For any task that is code-related, you need to test it through, whenever possible end-to-end, using playwright.

Before moving the task to `/done`, get confirmation and feedback from the user.

Upon completion, we'll usually commit with a message referring the task and will have a quick code review session after. To hep with this, we want a *Code Summary* section in the completion notes summarizing the code changes that were made.
