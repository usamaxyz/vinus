#!/usr/bin/env node
let logger = require('../logger'),
    fs = require('fs');

/*
 * processing args
 */

//get args from cli
const [, , ...args] = process.argv;

if (args.length) {
    args.forEach(element => {
        let requestedTask = element.toLowerCase();
        switch (element) {
            case 'init':
                init();
                break;
            default:
                logger.error(`Unknown task: ${requestedTask}`);
        }
    });
}

/*
 * end of processing args
 */

function init() {
    if (!fs.existsSync('start.js')) {
        fs.createReadStream('node_modules/vinus/templates/start.js').pipe(fs.createWriteStream('start.js'));
        logger.success('start.js generated.');
    }
    else
        logger.error('start.js already exist!');

    if (!fs.existsSync('.babelrc')) {
        fs.createReadStream('node_modules/vinus/templates/.babelrc').pipe(fs.createWriteStream('.babelrc'));
        logger.success('.babelrc generated.');

    }
    else
        logger.error('.babelrc already exist!');

    if (!fs.existsSync('tsconfig.json')) {
        fs.createReadStream('node_modules/vinus/templates/tsconfig.json').pipe(fs.createWriteStream('tsconfig.json'));
        logger.success('tsconfig.json generated.');
    }
    else
        logger.error('tsconfig.json already exist!');

    if (!fs.existsSync('gulpfile.js')) {
        fs.createReadStream('node_modules/vinus/templates/gulpfile.js').pipe(fs.createWriteStream('gulpfile.js'));
        logger.success('gulpfile.js generated.');
    }
    else
        logger.error('gulpfile.js already exist!');
}