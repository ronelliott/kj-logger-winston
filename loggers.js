'use strict';

var is = require('is');

module.exports.add = function($$resolver, winston, $opts) {
    Object.keys($opts)
        .forEach(function(name) {
            var cfg = $opts[name];

            if (cfg.enabled) {
                winston.loggers.add(name, cfg.options);

                if (cfg.inject) {
                    var logger = winston.loggers.get(name);
                    $$resolver.add(is.string(cfg.inject) ? cfg.inject : name, logger);
                }
            }
        });
};
