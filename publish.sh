#!/usr/bin/env bash
#
# publish.sh — sync the Obsidian "Published/" folder to the Quartz repo and deploy.
#
# WHAT IT DOES
#   1. Mirrors the vault's  Published/  into the repo's  content/  (rsync --delete).
#   2. In the COPY only (never the vault):
#        - converts .tif/.tiff images to .jpg (browsers can't render tif)
#        - renames images to web-safe slugs (lowercase, hyphens)
#        - rewrites the matching ![[embeds]] / ![](links) in the .md files
#   3. Commits and pushes to  main , which triggers the Cloudflare Pages rebuild.
#
#   Your Obsidian vault is the source of truth and is left untouched — keep writing
#   with whatever filenames you like; this script web-safes the published copy.
#
# USAGE
#   cd ~/Documents/camcamdotzip
#   ./publish.sh                       # sync, commit, push
#   ./publish.sh "your commit message" # custom commit message
#   DRY_RUN=1 ./publish.sh             # preview everything, change nothing
#   NO_PUSH=1 ./publish.sh             # sync + commit locally, but don't push
#
set -euo pipefail

# ---- paths (edit if your vault or repo ever moves) --------------------------
VAULT_PUBLISHED="/Users/cam/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/Cameron/Published"
REPO="/Users/cam/Documents/camcamdotzip"
CONTENT="$REPO/content"
BRANCH="main"

DRY_RUN="${DRY_RUN:-0}"
NO_PUSH="${NO_PUSH:-0}"
COMMIT_MSG="${1:-Publish site update ($(date '+%Y-%m-%d %H:%M'))}"

# ---- sanity checks ----------------------------------------------------------
if [ ! -d "$VAULT_PUBLISHED" ]; then
  echo "ERROR: vault Published/ not found:"
  echo "  $VAULT_PUBLISHED"
  exit 1
fi
if [ ! -d "$REPO/.git" ]; then
  echo "ERROR: repo not found (no .git) at: $REPO"
  exit 1
fi

mkdir -p "$CONTENT"

echo "=== 1/3  Mirroring Published/ -> content/ ==="
RSYNC_FLAGS=(-a --delete --exclude '.DS_Store' --exclude '.obsidian/' --exclude '.trash/' --exclude '.git/')
if [ "$DRY_RUN" = "1" ]; then
  RSYNC_FLAGS+=(--dry-run -v)
fi
rsync "${RSYNC_FLAGS[@]}" "$VAULT_PUBLISHED/" "$CONTENT/"

echo
echo "=== 2/3  Web-safing images + rewriting embeds (in content/ only) ==="
DRY_RUN="$DRY_RUN" CONTENT="$CONTENT" python3 - <<'PYEOF'
import os, re, subprocess, sys
from urllib.parse import quote

content = os.environ["CONTENT"]
dry = os.environ.get("DRY_RUN", "0") == "1"

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".tif", ".tiff", ".bmp", ".svg"}

def slugify(base: str) -> str:
    base = base.lower()
    base = re.sub(r"[^a-z0-9]+", "-", base)
    base = re.sub(r"-+", "-", base).strip("-")
    return base or "image"

# Build old-basename -> new-basename map, applying renames / tif conversion.
rename_map = {}
for root, _dirs, files in os.walk(content):
    for fn in files:
        stem, ext = os.path.splitext(fn)
        ext_l = ext.lower()
        if ext_l not in IMAGE_EXTS:
            continue
        new_ext = ".jpg" if ext_l in (".tif", ".tiff") else ext_l
        new_fn = f"{slugify(stem)}{new_ext}"
        if new_fn == fn:
            continue
        old_path = os.path.join(root, fn)
        new_path = os.path.join(root, new_fn)
        rename_map[fn] = new_fn
        if dry:
            print(f"  RENAME: {fn}\n      ->  {new_fn}")
            continue
        if ext_l in (".tif", ".tiff"):
            # convert bytes to jpeg, then drop the original
            subprocess.run(["sips", "-s", "format", "jpeg", old_path, "--out", new_path],
                           check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            os.remove(old_path)
        else:
            os.rename(old_path, new_path)

if not rename_map:
    print("  No images needed web-safing.")
else:
    # Rewrite embeds/links in every markdown file under content/.
    for root, _dirs, files in os.walk(content):
        for fn in files:
            if not fn.lower().endswith(".md"):
                continue
            p = os.path.join(root, fn)
            with open(p, "r", encoding="utf-8") as fh:
                text = fh.read()
            orig = text
            for old, new in rename_map.items():
                text = text.replace(old, new)              # literal (wikilinks, html)
                text = text.replace(quote(old), quote(new))  # %20-encoded md links
            if text != orig and not dry:
                with open(p, "w", encoding="utf-8") as fh:
                    fh.write(text)
            if text != orig and dry:
                print(f"  WOULD rewrite embeds in: {os.path.relpath(p, content)}")
PYEOF

echo
echo "=== 3/3  Commit + push ==="
cd "$REPO"

if [ "$DRY_RUN" = "1" ]; then
  echo "  DRY RUN — nothing was changed. The output above shows what would sync."
  echo "  Re-run without DRY_RUN=1 to commit and deploy."
  exit 0
fi

git add -A content

if git diff --cached --quiet; then
  echo "  Nothing changed — site already up to date."
  exit 0
fi

git commit -m "$COMMIT_MSG"

if [ "$NO_PUSH" = "1" ]; then
  echo "  Committed locally. NO_PUSH=1 set, so not pushing."
  exit 0
fi

git push origin "$BRANCH"
echo
echo "Done. Cloudflare Pages will rebuild from the push (~1-2 min)."
echo "Live: https://camcam.zip/coral/literature-review"
