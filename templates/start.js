let vinus = require('vinus');

vinus
    .css(['src/styles/style.css'], 'dist/styles/app.css')
    .withRtl()

    .babel(['src/scripts/index.js'], 'dist/scripts/app.js')


/*

Api Function:
-------------
newCss()
src(dist)
dist(dist)
concat(name)
asSass()
asLess()
withRtl()
rename(name)

newJs()
src(dist)
dist(dist)
concat(name)
babelify(opts)
browserify()
asTs(opts)
rename(name)

//alias
css(src, dist)
sass(src, dist)
less(src, dist)
js(src, dist)
vue(src, dist)
babel(src, dist)
ts(src, dist)

 */