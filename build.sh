#!/bin/sh
# Builds the app as it is served, into .deploy/ (or the folder named): the page's 310 module files as one
# minified script (app.js, with a source map), the stylesheet minified, everything else as it is. The source
# stays plain modules with no build: this runs only for a release (deploy-cf.sh, .github/workflows/pages.yml)
# and for verify.sh, which plays the built app. Measured 2026-11-17: 322 requests a launch become 6, the first
# download 874 KB -> 590 KB gzipped, a start on a 4x slowed CPU 373 ms -> 116 ms.
set -e
cd "$(dirname "$0")"
PATH=/opt/homebrew/bin:$PATH   # the plain `node` shim on this machine is broken
OUT=${1:-.deploy}
ESBUILD="npx -y esbuild@0.25.10"
rm -rf "$OUT" && mkdir -p "$OUT"
git ls-files sw.js manifest.json icon-180.png icon-512.png fonts | rsync -a --files-from=- . "$OUT/"   # only what git tracks
# the entry is the page's own module tags, in their order; no --target: the syntax ships as written
grep -o '<script type="module" src="[^"]*"' index.html | sed -E 's|.*src="(.*)"|import "./\1";|' |
  $ESBUILD --bundle --format=esm --minify --charset=utf8 --sourcemap --sourcefile=entry.js --log-level=warning --outfile="$OUT/app.js"
$ESBUILD app.css --minify --charset=utf8 --log-level=warning --outfile="$OUT/app.css"
# the page: one script tag for the 310, and its build time (Cloudflare sends no Last-Modified; app.js reads this)
sed -e 's|<script type="module" src="js/core.js"></script>|<script type="module" src="app.js"></script>|' \
    -e '/<script type="module" src="[a-z]*\//d' -e 's|<link rel="modulepreload"[^>]*>||g' \
    -e "s|<title>|<meta name=\"build\" content=\"$(git log -1 --format=%cI)\"><title>|" index.html > "$OUT/index.html"
[ "$(grep -c '<script type="module"' "$OUT/index.html")" = 1 ] || { echo "build: the page should name one module, app.js"; exit 1; }
echo "build: $OUT from $(git rev-parse --short HEAD), app.js $(($(wc -c < "$OUT/app.js") / 1024)) KB"
