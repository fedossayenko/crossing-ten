#!/bin/sh
# Publish the app to Cloudflare (wrangler.jsonc) from this machine — no CI, so a GitHub Actions outage cannot
# hold a release up. The built app (build.sh) goes up, and only from a clean tree.
set -e
cd "$(dirname "$0")"
APP="index.html app.css sw.js manifest.json icon-180.png icon-512.png fonts js kinds"
git diff --quiet HEAD -- $APP || { echo "deploy-cf: the app has uncommitted changes; commit first"; exit 1; }
./build.sh .deploy   # one minified script and stylesheet, stamped with the commit's time
npx -y wrangler@4 deploy "$@"
