let _log = require('fancy-log'),
    colors = require('ansi-colors'),
    util = require('util');

module.exports = {
    log: function (msg) {
        _log(msg);
    },
    logObj: function (obj) {
        _log(util.inspect(obj, { showHidden: false, depth: null }));
    },
    info: function (msg) {
        _log(colors.blue(msg));
    },
    success: function (msg) {
        _log(colors.green(msg));
    },
    warning: function (msg) {
        _log(colors.yellow(msg));
    },
    error: function (msg) {
        _log(colors.red(msg));
    },
};