#!/usr/bin/env sh

# Run without argument: Prepare all static files, create Live pages if Map DB files have changed
  # First run, or changes to HTML/CSS/client-side JS
# Run with "update": Don't prepare static files, only update Live pages (and only if Map DB files have changed)
  # Later runs where only information changes and no other files need to be updated
# Run with "full": Prepare all static files and recreate all Live pages even if Map DB files haven't changed
  # Required for changes to note map generation so all pages receive the update

if [ "$1" != "update" ]; then
  echo "Create build folders..."
  mkdir -p build/lives build/towers

  echo "Copy .htaccess..."
  cp .htaccess build

  echo "Copy Vendor Files..."
  cp -r vendor build/vendor

  echo "Minify Javascript..."
  mkdir -p build/js
  for F in js/*.js; do
      echo "    ${F}"
      sed '1,1{s/true/false/}' ${F} | uglifyjs --compress sequences=true,conditionals=true,booleans=true,dead_code=true,unused=true,if_return=true,join_vars=true --mangle -o build/${F}
  done

  echo "Minify CSS..."
  mkdir -p build/css
  for F in css/*.css; do
      echo "    ${F}"
      purifycss ${F} index.html rankings.html notemap-reader.js mapdb.js dlp.js rankings.js js/mapdb.js vendor/materialize.js -m -o build/${F}
  done

  echo "Minify Index page..."
  html-minifier --collapse-whitespace -o build/index.html index.html

  echo "Crush PNG images..."
  mkdir -p build/image
  for F in image/*.png; do
      echo "    ${F}"
      pngcrush -s -rem gAMA -rem cHRM -rem iCCP -rem sRGB -rem alla -rem text ${F} build/${F}
  done
fi

if [ "$1" = "full" ]; then
  echo "Build all Note Map DB pages..."
  node mapdb.js full
  echo "Build all DLP pages..."
  node dlp.js full
  echo "Build Rankings page..."
  node rankings.js full
else
  echo "Build updated Note Map DB pages..."
  node mapdb.js
  echo "Build updated DLP pages..."
  node dlp.js
  echo "Update Rankings page if needed..."
  node rankings.js
fi

echo "Build Search Index..."
node makesearch.js

echo "Done."