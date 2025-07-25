#!/bin/bash

# Start development server in tmux session
SESSION_NAME="dev-server"

# Check if session already exists
if tmux has-session -t $SESSION_NAME 2>/dev/null; then
    echo "Dev server session already exists. Attaching..."
    tmux attach-session -t $SESSION_NAME
else
    echo "Starting new dev server session..."
    tmux new-session -d -s $SESSION_NAME 'npm run dev'
    echo "Dev server started in tmux session: $SESSION_NAME"
    echo "To attach: tmux attach-session -t $SESSION_NAME"
    echo "To view logs: tmux capture-pane -t $SESSION_NAME -p"
fi