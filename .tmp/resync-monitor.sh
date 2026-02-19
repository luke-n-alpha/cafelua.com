#!/usr/bin/env bash
set -euo pipefail
while true; do
  ts=$(date "+%Y-%m-%d %H:%M:%S")
  dirs=$(find public/desk -mindepth 1 -maxdepth 1 -type d | wc -l)
  files=$(find public/desk -mindepth 2 -maxdepth 2 -type f | wc -l)
  posts=$(grep -o "externalUrl:" src/data/desk/_naver-posts.ts 2>/dev/null | wc -l)
  proc=$(ps -p 3689391 -o etime,%cpu,%mem,stat --no-headers 2>/dev/null | xargs || true)
  if [ -z "${proc}" ]; then proc="STOPPED"; fi
  echo "[$ts] proc=$proc posts=$posts dirs=$dirs files=$files" >> .tmp/resync-monitor.log
  sleep 600
done
