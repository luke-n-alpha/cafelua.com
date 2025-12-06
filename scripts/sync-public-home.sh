#!/usr/bin/env bash
set -euo pipefail

# Sync the Next.js App Router source from private `src/` into `public-home/`,
# then optionally build/commit/push the public repo.
# Usage:
#   ./src/scripts/sync-public-home.sh           # copy + build
#   ./src/scripts/sync-public-home.sh --push    # copy + build + git add/commit/push
#
# Environment:
#   SKIP_BUILD=1 to skip npm run build inside public-home
#   COMMIT_MSG="..." to override default commit message when using --push

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd -P)"
PRIVATE_SRC="$ROOT_DIR/src"
PUBLIC_DIR="$ROOT_DIR/public-home"

require_dir() {
    if [[ ! -d "$1" ]]; then
        echo "Missing directory: $1" >&2
        exit 1
    fi
}

require_dir "$PRIVATE_SRC"
require_dir "$PUBLIC_DIR"

echo "Syncing Next.js app to public-home..."

rsync -a --delete \
    --exclude ".next" \
    --exclude "node_modules" \
    --exclude "test-results" \
    --exclude ".swc" \
    --exclude "coverage" \
    "$PRIVATE_SRC/" "$PUBLIC_DIR/"

echo "Sync complete."

if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
    echo "Building public-home..."
    (cd "$PUBLIC_DIR" && npm install && npm run build)
fi

if [[ "${1:-}" == "--push" ]]; then
    COMMIT_MSG="${COMMIT_MSG:-chore: sync all sources from private}"
    echo "Committing and pushing public-home..."
    (cd "$PUBLIC_DIR" && git add . && git commit -m "$COMMIT_MSG" && git push origin main)
fi

echo "Done. Updated files are in $PUBLIC_DIR"
