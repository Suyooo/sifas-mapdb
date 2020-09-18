#!/usr/bin/env sh

echo "Create empty build folder..."
rm -rf build
mkdir build

echo "Copy fonts..."
cp --recursive fonts build
echo "Copy change log..."
cp changelog build
echo "Copy app manifest..."
cp manifest.json build

echo "Copy Library JS..."
mkdir build/vendor
for F in vendor/*.js; do
    echo "    ${F}"
    cp ${F} build/vendor
done

echo "Copy Library CSS..."
for F in vendor/*.css; do
    echo "    ${F}"
    purifycss ${F} index.html tower.html notemap-reader.js mapdb.js tower.js js/mapdb.js vendor/materialize.js -m -o build/${F}
done

echo "Minify Javascript..."
mkdir build/js
for F in js/*.js; do
    echo "    ${F}"
    uglifyjs --compress sequences=true,conditionals=true,booleans=true,dead_code=true,unused=true,if_return=true,join_vars=true --mangle -o build/${F} ${F}
done

echo "Minify CSS..."
mkdir build/css
for F in css/*.css; do
    echo "    ${F}"
    purifycss ${F} index.html tower.html notemap-reader.js mapdb.js tower.js js/mapdb.js vendor/materialize.js -m -o build/${F}
done

echo "Build DLP page..."
node tower.js
echo "Build Note Map DB page..."
node mapdb.js

echo "Crush PNG images..."
mkdir build/image
for F in image/*.png; do
    echo "    ${F}"
    pngcrush -s -rem gAMA -rem cHRM -rem iCCP -rem sRGB -rem alla -rem text ${F} build/${F}
done

echo "Done."