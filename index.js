let logger = require('./logger'),
    vinus = (function () {

        let obj = {
            styles: [],
            scripts: [],
            copies: [],
        };

        let current = undefined;

        let newCopy = function () {
            current = {
                name: 'copy',
                src: undefined,
                dist: undefined,
                filename: undefined,
                concat: false,
            };
            obj.copies.push(current);
            return vinus;
        };

        let newCss = function () {
            current = {
                name: 'css',
                src: undefined,
                dist: undefined,
                filename: undefined,
                concat: false,
                isSass: false,
                isLess: false,
                generateRtl: false,
            };
            obj.styles.push(current);
            return vinus;
        };

        let newJs = function () {
            current = {
                name: 'js',
                src: undefined,
                dist: undefined,
                filename: undefined,
                concat: false,
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
            obj.scripts.push(current);
            return vinus;
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

        //aliases
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
            src: function (src) {
                current.src = src;
                return this;
            },
            dist: function (dist) {
                return _dist.call(this, dist, current);
            },
            rename: function (name) {
                //the if here is for reason: 
                // concat() without parameters and the name is already set => this if prevent override with undefined name
                if (name)
                    current.filename = name;
                return this;
            },
            concat: function (name) {
                current.concat = true;
                return this.rename(name);
            },

            asSass: function () {
                current.isSass = true;
                return this;
            },
            asLess: function () {
                current.isLess = true;
                return this;
            },
            withRtl: function () {
                current.generateRtl = true;
                return this;
            },
            babelify: function (opts) {
                current.babel.status = true;
                current.babel.options = opts;
                return this;
            },
            browserify: function () {
                current.browserify.status = true;
                if (Array.isArray(current.src))
                    current.browserify.sourceName = current.src[0].split('/').pop();
                else
                    current.browserify.sourceName = current.src.split('/').pop();
                return this;
            },
            asTs: function (opts) {
                current.typescript.status = true;
                current.typescript.options = opts;
                return this;
            },

            //root functions
            newJs,
            newCss,
            newCopy,
            get,

            //aliases
            css,
            sass,
            less,
            js,
            vue,
            babel,
            ts,
            copy,
        };
    })();

module.exports = vinus;