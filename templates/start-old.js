let gulpObj = {
    styles: [{
        src: ['src/styles/style.css'],
        dist: 'dist/styles',
        options: {
            concat: {
                status: false,
                fileName: 'app.css',
            },
            isSass: false,
            isLess: false,
            generateRtl: false,
        },
    }],
    scripts: [{
        src: ['src/scripts/index.js'],
        dist: 'dist/scripts',
        options: {
            concat: {
                status: false,
                fileName: 'app.js',
            },
            babel: {
                status: false,
                options: {
                    //these options overide .babelrc options
                    //presets: ["es2015"],
                }
            },
            browserify: {
                status: false,
                fileName: 'app.js',
            },
            typescript: {
                status: false,
                options: {
                    //these options overide tsconfig.json options
                    // target: 'ES6',
                }
            },
        },
    }],
    pre: {
        // production: function(){
        //     process.env.NODE_ENV = 'production';
        // }
    }
};


module.exports = gulpObj;