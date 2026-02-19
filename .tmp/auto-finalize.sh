#!/usr/bin/env bash
set -euo pipefail
TARGET=2390
LOG=.tmp/auto-finalize.log

echo "[$(date '+%F %T')] auto-finalize start" >> "$LOG"

count_posts() {
  node -e "const fs=require('fs');const s=fs.readFileSync('src/data/desk/_naver-posts.ts','utf8');const n=(s.match(/\\n\\s*slug:\\s*\\\"/g)||[]).length;process.stdout.write(String(n));"
}

while true; do
  C=$(count_posts)
  echo "[$(date '+%F %T')] posts=$C/$TARGET" >> "$LOG"

  if [ "$C" -ge "$TARGET" ]; then
    break
  fi

  if ! pgrep -f "fetch-naver-blog.ts" >/dev/null 2>&1; then
    echo "[$(date '+%F %T')] fetch process down; supervisor should restart" >> "$LOG"
  fi

  sleep 120
done

echo "[$(date '+%F %T')] reached target; running seo generate" >> "$LOG"
npm run seo:generate >> "$LOG" 2>&1

echo "[$(date '+%F %T')] running typecheck" >> "$LOG"
npx tsc -p tsconfig.json --noEmit >> "$LOG" 2>&1

echo "[$(date '+%F %T')] preparing git commit" >> "$LOG"
git add -A
git restore --staged .tmp tsconfig.tsbuildinfo || true

if git diff --cached --quiet; then
  echo "[$(date '+%F %T')] nothing staged; exiting" >> "$LOG"
  exit 0
fi

git commit -m "feat(desk): complete naver blog sync and preserve desk state" >> "$LOG" 2>&1
git push >> "$LOG" 2>&1

echo "[$(date '+%F %T')] commit and push done" >> "$LOG"
