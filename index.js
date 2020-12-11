let vinus = (function () {
    let groups = [],
        globals = {
            prodSuffix: '.min',
            rtlSuffix: '.rtl'
        },
        currentNode = undefined,
        currentGroup = undefined;

    let newGroup = function (name) {
        currentGroup = {
            name: name,
            styles: [],
            scripts: [],
            copies: [],
        };
        groups.push(currentGroup);
        return vinus;
    };

    let newCopy = function () {
        currentNode = {
            name: 'copy',
            src: undefined,
            dist: undefined,
            filename: undefined,
            concat: false,
        };
        currentGroup.copies.push(currentNode);
        return vinus;
    };

    let newCss = function () {
        currentNode = {
            name: 'css',
            src: undefined,
            dist: undefined,
            filename: undefined,
            concat: false,
            isSass: false,
            generateRtl: false,
        };
        currentGroup.styles.push(currentNode);
        return vinus;
    };

    let newJs = function () {
        currentNode = {
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
        currentGroup.scripts.push(currentNode);
        return vinus;
    };

    let get = function (group) {

        if (!group) {
            //Get all groups
            let tempGroup = {
                name: 'All',
                styles: [],
                scripts: [],
                copies: [],
            };

            for (let item of groups) {
                for (let s of item.styles) {
                    tempGroup.styles.push(s);
                }
                for (let s of item.scripts) {
                    tempGroup.scripts.push(s);
                }
                for (let s of item.copies) {
                    tempGroup.copies.push(s);
                }
            }

            return tempGroup;
        }

        //return givin group or undefined
        return groups.filter(g => g.name === group)[0];
    };

    //shared
    function _dist(dist, obj) {
        if (dist === undefined || dist === '') {
            obj.dist = '';
            return this;
        }
        else {
            let pathArr = dist.split('/'),
                fileName = pathArr.pop(),
                index = fileName.indexOf('.');
            if (index !== -1 && index !== 0) {
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
        return newCss().src(src).dist(dist);
    };
    let sass = function (src, dist) {
        let temp = newCss().src(src).dist(dist).asSass();
        currentNode.name = 'sass';
        return temp;
    };

    let js = function (src, dist) {
        return newJs().src(src).dist(dist);
    };
    let vue = function (src, dist) {
        let temp = newJs().src(src).dist(dist).babelify().browserify();
        currentNode.name = 'vue';
        return temp;
    };
    let ts = function (src, dist) {
        let temp = newJs().src(src).dist(dist).babelify().browserify().asTs();
        currentNode.name = 'ts';
        return temp;
    };
    let babel = function (src, dist) {
        let temp = newJs().src(src).dist(dist).babelify();
        currentNode.name = 'babel';
        return temp;
    };

    let copy = function (src, dist) {
        return newCopy().src(src).dist(dist);
    };


    return {
        src: function (src) {
            currentNode.src = src;
            return this;
        },
        dist: function (dist) {
            return _dist.call(this, dist, currentNode);
        },
        rename: function (name) {
            //the if here is for reason:
            // concat() without parameters and the name is already set => this if prevent override with undefined name
            if (name)
                currentNode.filename = name;
            return this;
        },
        concat: function (name) {
            currentNode.concat = true;
            return this.rename(name);
        },

        asSass: function () {
            currentNode.isSass = true;
            return this;
        },
        withRtl: function () {
            currentNode.generateRtl = true;
            return this;
        },
        babelify: function (opts) {
            currentNode.babel.status = true;
            currentNode.babel.options = opts;
            return this;
        },
        browserify: function () {
            currentNode.browserify.status = true;
            if (Array.isArray(currentNode.src))
                currentNode.browserify.sourceName = currentNode.src[0].split('/').pop();
            else
                currentNode.browserify.sourceName = currentNode.src.split('/').pop();
            return this;
        },
        asTs: function (opts) {
            currentNode.typescript.status = true;
            currentNode.typescript.options = opts;
            return this;
        },

        setGlobals: function (obj) {
            for (let k in obj)
                globals[k] = obj[k];
            return this;
        },

        getGlobals: function () {
            return globals;
        },

        //root functions
        newJs,
        newCss,
        newCopy,
        newGroup,
        get,

        //aliases
        css,
        sass,
        js,
        vue,
        babel,
        ts,
        copy,
    };
})();

module.exports = vinus.newGroup('default');