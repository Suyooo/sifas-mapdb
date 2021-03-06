#!/usr/bin/env sh

echo "Create build folders..."
mkdir -p build/lives build/towers

echo "Copy .htaccess..."
cp .htaccess build

echo "Copy Vendor Files..."
cp -r vendor build/vendor

echo "Minify Javascript..."
mkdir build/js
for F in js/*.js; do
    echo "    ${F}"
    sed '1,1{s/true/false/}' ${F} | uglifyjs --compress sequences=true,conditionals=true,booleans=true,dead_code=true,unused=true,if_return=true,join_vars=true --mangle -o build/${F}
done

echo "Minify CSS..."
mkdir build/css
for F in css/*.css; do
    echo "    ${F}"
    purifycss ${F} index.html rankings.html notemap-reader.js mapdb.js dlp.js rankings.js js/mapdb.js vendor/materialize.js -m -o build/${F}
done

echo "Minify Index page..."
html-minifier --collapse-whitespace -o build/index.html index.html

echo "Build updated Note Map DB pages..."
node mapdb.js
echo "Build updated DLP pages..."
node dlp.js
echo "Build Rankings page..."
node rankings.js

echo "Crush PNG images..."
mkdir build/image
for F in image/*.png; do
    echo "    ${F}"
    pngcrush -s -rem gAMA -rem cHRM -rem iCCP -rem sRGB -rem alla -rem text ${F} build/${F}
done

echo "Done."