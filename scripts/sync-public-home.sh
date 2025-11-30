#!/usr/bin/env bash
set -euo pipefail

# Sync intro assets/components from the private repo into the public-home submodule,
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

require_dir "$PRIVATE_SRC/src/components"
require_dir "$PUBLIC_DIR/src/components"

copy_file() {
    local src="$1"
    local dest="$2"
    if [[ ! -f "$src" ]]; then
        echo "Missing source file: $src" >&2
        exit 1
    fi
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "Copied $(basename "$src")"
}

echo "Syncing intro assets/components to public-home..."
# Sync App shell and styles
copy_file "$PRIVATE_SRC/src/App.tsx" "$PUBLIC_DIR/src/App.tsx"
copy_file "$PRIVATE_SRC/src/index.css" "$PUBLIC_DIR/src/index.css"
copy_file "$PRIVATE_SRC/src/styles/variables.css" "$PUBLIC_DIR/src/styles/variables.css"

# Sync components
copy_file "$PRIVATE_SRC/src/components/IntroPage.tsx" "$PUBLIC_DIR/src/components/IntroPage.tsx"
copy_file "$PRIVATE_SRC/src/components/IntroPage.css" "$PUBLIC_DIR/src/components/IntroPage.css"
copy_file "$PRIVATE_SRC/src/components/LoungePage.tsx" "$PUBLIC_DIR/src/components/LoungePage.tsx"
copy_file "$PRIVATE_SRC/src/components/LoungePage.css" "$PUBLIC_DIR/src/components/LoungePage.css"
copy_file "$PRIVATE_SRC/src/components/UnderConstruction.tsx" "$PUBLIC_DIR/src/components/UnderConstruction.tsx"
copy_file "$PRIVATE_SRC/src/components/UnderConstruction.css" "$PUBLIC_DIR/src/components/UnderConstruction.css"
copy_file "$PRIVATE_SRC/src/components/BackgroundMusic.tsx" "$PUBLIC_DIR/src/components/BackgroundMusic.tsx"
copy_file "$PRIVATE_SRC/src/components/BackgroundMusic.css" "$PUBLIC_DIR/src/components/BackgroundMusic.css"
copy_file "$PRIVATE_SRC/src/components/CafeLayout.tsx" "$PUBLIC_DIR/src/components/CafeLayout.tsx"
copy_file "$PRIVATE_SRC/src/components/CafeLayout.css" "$PUBLIC_DIR/src/components/CafeLayout.css"


# Sync services
copy_file "$PRIVATE_SRC/src/services/WeatherService.ts" "$PUBLIC_DIR/src/services/WeatherService.ts"

# Sync i18n
copy_file "$PRIVATE_SRC/src/i18n.ts" "$PUBLIC_DIR/src/i18n.ts"

# Sync assets & public files
copy_file "$PRIVATE_SRC/public/intro-logo.png" "$PUBLIC_DIR/public/intro-logo.png"
copy_file "$PRIVATE_SRC/index.html" "$PUBLIC_DIR/index.html"
copy_file "$PRIVATE_SRC/public/og-cover.png" "$PUBLIC_DIR/public/og-cover.png"

# Sync directories (simple copy)
rm -rf "$PUBLIC_DIR/src/assets"
cp -R "$PRIVATE_SRC/src/assets/" "$PUBLIC_DIR/src/assets/"
rm -rf "$PUBLIC_DIR/public/intro-background-img"
cp -R "$PRIVATE_SRC/public/intro-background-img/" "$PUBLIC_DIR/public/intro-background-img/"
rm -rf "$PUBLIC_DIR/public/lounge-background-img"
cp -R "$PRIVATE_SRC/public/lounge-background-img/" "$PUBLIC_DIR/public/lounge-background-img/"
rm -rf "$PUBLIC_DIR/public/sounds"
cp -R "$PRIVATE_SRC/public/sounds/" "$PUBLIC_DIR/public/sounds/"

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
