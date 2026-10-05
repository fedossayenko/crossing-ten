#!/bin/sh
# Publish the app to Cloudflare (wrangler.jsonc) from this machine — no CI, so a GitHub Actions outage cannot
# hold a release up. Exactly the app's files as git tracks them go up, and only from a clean tree.
set -e
cd "$(dirname "$0")"
APP="index.html app.css sw.js manifest.json icon-180.png icon-512.png fonts js kinds"
git diff --quiet HEAD -- $APP || { echo "deploy-cf: the app has uncommitted changes; commit first"; exit 1; }
rm -rf .deploy && mkdir .deploy
git ls-files $APP | rsync -a --files-from=- . .deploy/
# Cloudflare sends no Last-Modified: the page carries its build time instead (app.js reads either)
sed -i '' "s|<title>|<meta name=\"build\" content=\"$(git log -1 --format=%cI)\"><title>|" .deploy/index.html
echo "deploy-cf: $(find .deploy -type f | wc -l | tr -d ' ') files from $(git rev-parse --short HEAD)"
npx -y wrangler@4 deploy "$@"
