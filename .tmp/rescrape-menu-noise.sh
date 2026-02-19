#!/usr/bin/env bash
set -euo pipefail
TOTAL=$(wc -l < .tmp/menu-noise-lognos.txt | tr -d ' ')
N=0
while IFS= read -r LOG; do
  [ -z "$LOG" ] && continue
  N=$((N+1))
  echo "[$N/$TOTAL] $LOG"
  TS_NODE_TRANSPILE_ONLY=1 node --loader ts-node/esm scripts/update-naver-post.ts --log "$LOG" || echo "FAIL $LOG"
  sleep 0.2
done < .tmp/menu-noise-lognos.txt
