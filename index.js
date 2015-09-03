'use strict';

var fmt = require('simple-fmt'),
    is = require('is'),
    loggers = require('./loggers'),
    appLogging = require('./app-logging'),
    requestLogging = require('./request-logging');

module.exports = function($opts) {
    $opts = $opts || {};

    var loggersCfg = $opts.loggers || {},
        appCfg = $opts.app || {},
        requestCfg = $opts.request || {};

    return function($$app, $$resolver) {
        var winston = $$resolver($opts.resource || '$winston') || require('winston');
        loggers.add($$resolver, winston, loggersCfg);
        appCfg.enabled && appLogging.init($$app, $$resolver, appCfg);
        requestCfg.enabled && requestLogging.init($$app, $$resolver, requestCfg);
    };
};
