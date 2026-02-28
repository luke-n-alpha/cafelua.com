#!/bin/bash
# Monitor all 5 translation shards
cd /home/luke/dev/cafelua.com/public-home

echo "=== $(date '+%H:%M:%S') Translation Shard Monitor ==="
echo ""

for i in 0 1 2 3 4; do
  lines=$(wc -l < .tmp/translate-results/shard-$i.jsonl 2>/dev/null || echo 0)
  mod=$(stat -c '%Y' .tmp/translate-results/shard-$i.jsonl 2>/dev/null || echo 0)
  now=$(date +%s)
  age=$(( now - mod ))

  # Check if process is running
  if ps aux | grep "shard-index $i" | grep -v grep > /dev/null 2>&1; then
    status="RUNNING"
  else
    status="DEAD"
  fi

  printf "  Shard %d: %-8s | %4d results | last update %ds ago\n" $i "$status" "$lines" "$age"
done

echo ""
total=$(for i in 0 1 2 3 4; do wc -l < .tmp/translate-results/shard-$i.jsonl 2>/dev/null; done | paste -sd+ | bc)
echo "  Total results: $total"

# Check for any dead shards
dead=$(for i in 0 1 2 3 4; do
  if ! ps aux | grep "shard-index $i" | grep -v grep > /dev/null 2>&1; then
    echo $i
  fi
done)

if [ -n "$dead" ]; then
  echo ""
  echo "  ⚠️  DEAD SHARDS: $dead"
fi
