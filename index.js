let logger = require('./logger'),
    vinus = (function () {

        let obj = {
            styles: [],
            scripts: [],
            copies: [],
        };

        //shared
        function _dist(dist, obj) {
            if (dist === undefined || dist === '') {
                obj.dist = '';
                return this;
            }
            else {
                let pathArr = dist.split('/');
                let fileName = pathArr.pop();
                if (fileName.indexOf('.') !== -1) {
                    //path with file name
                    obj.dist = pathArr.join('/');
                    return this.concat(fileName);
                }
                else {
                    //path only
                    obj.dist = dist;
                    return this;
                }
            }
        }

        let newCopy = function () {
            let _copy = {
                name: 'copy',
                src: undefined,
                dist: undefined,
                concat: {
                    status: false,
                    fileName: 'app.css',
                },
            };
            obj.copies.push(_copy);

            return {
                src: function (src) {
                    _copy.src = src;
                    return this;
                },
                dist: function (dist) {
                    return _dist.call(this, dist, _copy);
                }, 
                concat: function (name) {
                    //concat is used to concat and rename. Here it's used to rename only.
                    _copy.concat.status = true;
                    if (name)
                        _copy.concat.fileName = name;
                    return this;
                },
                newJs,
                newCss,
                newCopy,
                js,
                css,
                sass,
                less,
                vue,
                babel,
                ts,
                get,
                copy,
            }
        };

        let newCss = function () {
            let _css = {
                name: 'css',
                src: undefined,
                dist: undefined,
                concat: {
                    status: false,
                    fileName: 'app.css',
                },
                isSass: false,
                isLess: false,
                generateRtl: false,
            };
            obj.styles.push(_css);

            return {
                src: function (src) {
                    _css.src = src;
                    return this;
                },
                dist: function (dist) {
                    return _dist.call(this, dist, _css);
                },
                concat: function (name) {
                    _css.concat.status = true;
                    if (name)
                        _css.concat.fileName = name;
                    return this;
                },
                asSass: function () {
                    _css.isSass = true;
                    return this;
                },
                asLess: function () {
                    _css.isLess = true;
                    return this;
                },
                withRtl: function () {
                    _css.generateRtl = true;
                    return this;
                },
                rename: function (name) {
                    return this.concat(name);
                },
                newJs,
                newCss,
                newCopy,
                js,
                css,
                sass,
                less,
                vue,
                babel,
                ts,
                get,
                copy,
            }
        };

        let newJs = function () {
            let _js = {
                name: 'js',
                src: undefined,
                dist: undefined,
                concat: {
                    status: false,
                    fileName: 'app.js',
                },
                babel: {
                    status: false,
                    // options: undefined,
                },
                browserify: {
                    status: false,
                    // sourceName: undefined,
                },
                typescript: {
                    status: false,
                    // options: undefined,
                },
            };
            obj.scripts.push(_js);

            return {
                src: function (src) {
                    _js.src = src;
                    return this;
                },
                dist: function (dist) {
                    return _dist.call(this, dist, _js);
                },
                concat: function (name) {
                    _js.concat.status = true;
                    if (name)
                        _js.concat.fileName = name;
                    return this;
                },
                babelify: function (opts) {
                    _js.babel.status = true;
                    _js.babel.options = opts;
                    return this;
                },
                browserify: function () {
                    _js.browserify.status = true;
                    if (Array.isArray(_js.src))
                        _js.browserify.sourceName = _js.src[0].split('/').pop();
                    else
                        _js.browserify.sourceName = _js.src.split('/').pop();
                    return this;
                },
                asTs: function (opts) {
                    _js.typescript.status = true;
                    _js.typescript.options = opts;
                    return this;
                },
                rename: function (name) {
                    return this.concat(name);
                },

                newJs,
                newCss,
                newCopy,
                js,
                css,
                sass,
                less,
                vue,
                babel,
                ts,
                get,
                copy,
            }
        };

        let get = function () {
            obj.styles = obj.styles.filter(function (element) {
                if (element.src.length)
                    return element;
                else
                    logger.warning(element.name + ': No styles found!');
            });

            obj.scripts = obj.scripts.filter(function (element) {
                if (element.src.length)
                    return element;
                else
                    logger.warning(element.name + ': No scripts found!');
            });

            obj.copies = obj.copies.filter(function (element) {
                if (element.src.length)
                    return element;
                else
                    logger.warning(element.name + ': No copies found!');
            });
            return obj;
        };


        //alias
        let css = function (src, dist) {
            let temp = newCss().src(src).dist(dist);
            obj.styles[obj.styles.length - 1].name = 'css';
            return temp;
        };
        let sass = function (src, dist) {
            let temp = newCss().src(src).dist(dist).asSass();
            obj.styles[obj.styles.length - 1].name = 'sass';
            return temp;
        };
        let less = function (src, dist) {
            let temp = newCss().src(src).dist(dist).asLess();
            obj.styles[obj.styles.length - 1].name = 'less';
            return temp;
        };

        let js = function (src, dist) {
            let temp = newJs().src(src).dist(dist);
            obj.scripts[obj.scripts.length - 1].name = 'js';
            return temp;
        };
        let vue = function (src, dist) {
            let temp = newJs().src(src).dist(dist).babelify().browserify();
            obj.scripts[obj.scripts.length - 1].name = 'vue';
            return temp;
        };
        let ts = function (src, dist) {
            let temp = newJs().src(src).dist(dist).babelify().browserify().asTs();
            obj.scripts[obj.scripts.length - 1].name = 'ts';
            return temp;
        };
        let babel = function (src, dist) {
            let temp = newJs().src(src).dist(dist).babelify();
            obj.scripts[obj.scripts.length - 1].name = 'babel';
            return temp;
        };
        
        let copy = function (src, dist) {
            let temp = newCopy().src(src).dist(dist);
            obj.copies[obj.copies.length - 1].name = 'copy';
            return temp;
        };

        return {
            newJs,
            newCss,
            newCopy,
            js,
            css,
            sass,
            less,
            vue,
            babel,
            ts,
            get,
            copy,
        }
    })();


module.exports = vinus;