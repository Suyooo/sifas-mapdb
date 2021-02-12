#!/usr/bin/env sh

echo "Create empty build folder..."
rm -rf build
mkdir build
mkdir build/lives

echo "Copy fonts..."
cp --recursive fonts build
echo "Copy change log..."
cp changelog build
echo "Copy app manifest..."
cp manifest.json build
echo "Copy .htaccess..."
cp .htaccess build

echo "Copy Library JS..."
mkdir build/vendor
for F in vendor/*.js; do
    echo "    ${F}"
    cp ${F} build/vendor
done

echo "Copy Library CSS..."
for F in vendor/*.css; do
    echo "    ${F}"
    purifycss ${F} index.html top.html notemap-reader.js mapdb.js dlp.js top.js js/mapdb.js vendor/materialize.js -m -o build/${F}
done

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
    purifycss ${F} index.html top.html notemap-reader.js mapdb.js dlp.js top.js js/mapdb.js vendor/materialize.js -m -o build/${F}
done

echo "Minify Index page..."
html-minifier --collapse-whitespace -o build/index.html index.html

echo "Build DLP page..."
node dlp.js
echo "Build Note Map DB page..."
node mapdb.js
echo "Build Rankings page..."
node top.js

echo "Crush PNG images..."
mkdir build/image
for F in image/*.png; do
    echo "    ${F}"
    pngcrush -s -rem gAMA -rem cHRM -rem iCCP -rem sRGB -rem alla -rem text ${F} build/${F}
done

echo "Done."