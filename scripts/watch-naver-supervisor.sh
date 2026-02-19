#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
STATE_DIR="$ROOT_DIR/.tmp"
WATCH_LOG="$STATE_DIR/naver-watchdog.log"
mkdir -p "$STATE_DIR"

echo "[$(date '+%F %T')] watchdog start" >> "$WATCH_LOG"

while true; do
  if pgrep -f "bash scripts/scrape_naver_supervisor.sh" >/dev/null; then
    echo "[$(date '+%F %T')] supervisor alive" >> "$WATCH_LOG"
  else
    echo "[$(date '+%F %T')] supervisor down -> restart" >> "$WATCH_LOG"
    nohup bash scripts/scrape_naver_supervisor.sh >/tmp/naver-supervisor-nohup.out 2>&1 &
    echo "[$(date '+%F %T')] restarted pid=$!" >> "$WATCH_LOG"
  fi
  sleep 60
done
