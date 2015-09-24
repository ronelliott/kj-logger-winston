'use strict';

var fmt = require('simple-fmt'),
    startTime = new Date().getTime();

module.exports.init = function($$app, $$resolver, $opts) {
    var logger = $$resolver($opts.logger),
        formatter = $opts.formatter || function(message) {
                return fmt.obj($opts.format || '{message}', {
                    message: message
                });
            },
        duration = function() {
            return new Date().getTime() - startTime;
        };

    $$app.on('app:start', function(app, port, host) {
        logger.info(formatter('Listening on ' + host + ':' + port));
    });

    $$app.on('app:init:end', function() {
        logger.info(formatter('Initialization complete, took ~' + duration() + 'ms'));
    });
};
