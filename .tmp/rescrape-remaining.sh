#!/usr/bin/env bash
cd /home/luke/dev/cafelua.com/public-home || exit 1
i=0
total=$(grep -c . .tmp/menu-noise-lognos-remaining.txt)
while IFS= read -r log; do
  [ -z "$log" ] && continue
  i=$((i+1))
  echo "[$(date '+%F %T')] [$i/$total] $log"
  TS_NODE_TRANSPILE_ONLY=1 node --loader ts-node/esm scripts/update-naver-post.ts --log "$log" >> .tmp/rescrape-remaining.log 2>&1 || echo "FAIL $log" >> .tmp/rescrape-remaining.log
  sleep 0.2
done < .tmp/menu-noise-lognos-remaining.txt
echo "[$(date '+%F %T')] DONE" >> .tmp/rescrape-remaining.log
