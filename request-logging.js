'use strict';

const fmt = require('simple-fmt');

module.exports.init = function($$app, $$resolver, $opts) {
    var level = $opts.level || 'info',
        logger = $$resolver($opts.logger),
        slowCfg = $opts.slow || {},
        startTime,
        duration = function() {
            return new Date().getTime() - startTime;
        },
        log = function(formatter) {
            return function($req, $res) {
                logger[level](formatter($req, $res));
            };
        },
        formatter = $opts.formatter || function(format) {
            return function($req, $res) {
                return fmt.obj(format, {
                    duration: duration(),
                    method: $req ? $req.method : null,
                    status: $res ? $res.status() : null,
                    url: $req ? $req.url : null
                });
            };
        };

    var requestFormatter = formatter($opts.format || '{method} - {status} - {duration}ms - {url}'),
        slowFormatter = formatter(slowCfg.format || '[pending] {method} - {duration}ms - {url}');

    $$app.on('request:begin', function() {
        startTime = new Date().getTime();
    });

    $$app.on('request:end', log(requestFormatter));
    slowCfg.enabled && $$app.on('request:slow', log(slowFormatter));
};
