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
rename(name)
asSass()
asLess()
withRtl()

newJs()
src(dist)
dist(dist)
concat(name)
rename(name)
babelify(opts)
browserify()
asTs(opts)

newcopy()
src(dist)
dist(dist)
rename(name)

newGroup(name)

//alias
css(src, dist)
sass(src, dist)
less(src, dist)
js(src, dist)
vue(src, dist)
babel(src, dist)
ts(src, dist)
copy(src, dist)

//configs
setGlobals({
    prodSuffix:'.min',
    rtlSuffix: '.rtl',
})
 */