#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

STATE_DIR="$ROOT_DIR/.tmp"
STATE_FILE="$STATE_DIR/naver-scrape.state"
LOG_FILE="$STATE_DIR/naver-scrape-supervisor.log"
PID_FILE="$STATE_DIR/naver-scrape-supervisor.pid"

mkdir -p "$STATE_DIR"

echo $$ > "$PID_FILE"

echo "[$(date '+%F %T')] supervisor start" | tee -a "$LOG_FILE"

# 전체보기 기준(약 160페이지, 페이지당 15개)
START_PAGE_DEFAULT=1
END_PAGE=160
MAX_POSTS=30
# 목록은 페이지당 15개 기준으로 순회.
COUNT_PER_PAGE=15
# 배치 크기에 맞춰 시작 페이지 점프 폭을 자동 계산한다.
STEP=$(( (MAX_POSTS + COUNT_PER_PAGE - 1) / COUNT_PER_PAGE ))
RETRY_PER_BATCH=3

if [[ -f "$STATE_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$STATE_FILE"
fi

NEXT_PAGE="${NEXT_PAGE:-$START_PAGE_DEFAULT}"

save_state() {
  cat > "$STATE_FILE" <<STATE
NEXT_PAGE=$NEXT_PAGE
LAST_OK_PAGE=${LAST_OK_PAGE:-0}
STATE
}

while [[ "$NEXT_PAGE" -le "$END_PAGE" ]]; do
  echo "[$(date '+%F %T')] batch start: page=$NEXT_PAGE" | tee -a "$LOG_FILE"

  attempt=1
  success=0
  while [[ "$attempt" -le "$RETRY_PER_BATCH" ]]; do
    echo "[$(date '+%F %T')] attempt $attempt/$RETRY_PER_BATCH page=$NEXT_PAGE" | tee -a "$LOG_FILE"

    if node --loader ts-node/esm scripts/fetch-naver-blog.ts \
      --max "$MAX_POSTS" \
      --count-per-page "$COUNT_PER_PAGE" \
      --start-page "$NEXT_PAGE" \
      --append \
      --download >> "$LOG_FILE" 2>&1; then
      success=1
      break
    fi

    echo "[$(date '+%F %T')] failed attempt=$attempt page=$NEXT_PAGE" | tee -a "$LOG_FILE"
    attempt=$((attempt + 1))
    sleep 5
  done

  if [[ "$success" -eq 1 ]]; then
    LAST_OK_PAGE="$NEXT_PAGE"
    NEXT_PAGE=$((NEXT_PAGE + STEP))
    save_state
    echo "[$(date '+%F %T')] batch ok, next=$NEXT_PAGE" | tee -a "$LOG_FILE"
  else
    echo "[$(date '+%F %T')] batch permanently failed page=$NEXT_PAGE, keep trying after cooldown" | tee -a "$LOG_FILE"
    save_state
    sleep 30
  fi

done

echo "[$(date '+%F %T')] ALL DONE" | tee -a "$LOG_FILE"
