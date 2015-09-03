'use strict';

var should = require('should'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire'),
    reflekt = require('reflekt'),
    initializer = require('../request-logging');

describe('request-logging', function() {
    beforeEach(function() {
        var self = this;

        this.listeners = {};

        this.app = {
            on: sinon.spy(function(signal, listener) {
                self.listeners[signal] = self.listeners[signal] || [];
                self.listeners[signal].push(listener);
            })
        };

        this.log = {
            info: sinon.spy()
        };

        this.req = {};

        this.res = {
            status: sinon.spy()
        };

        this.winston = {
            loggers: {
                add: sinon.spy(function(name) { return name; }),
                get: sinon.spy(function(name) { return name; })
            }
        };


        this.resolver = sinon.spy(new reflekt.ObjectResolver({
            'mock-request-logger': this.log,
            $$winston: this.winston
        }));
    });

    //it('should configure the request logger if it is enabled', function() {
    //    var opts = {
    //        request: {
    //            enabled: true
    //        }
    //    };
    //
    //    initializer(this.app, this.resolver, opts);
    //    this.app.on.called.should.equal(true);
    //    this.app.on.calledWith('request:begin').should.equal(true);
    //});

    //it('should not configure the request logger if it is disabled', function() {
    //    var opts = {
    //        request: {
    //            enabled: false
    //        }
    //    };
    //
    //    initializer(opts)(this.app, this.resolver);
    //    this.app.on.called.should.equal(false);
    //    this.app.on.calledWith('request:begin').should.equal(false);
    //});

    it('should resolve the logger', function() {
        var opts = {
            enabled: true,
            logger: 'mock-request-logger'
        };

        initializer.init(this.app, this.resolver, opts);
        var listener = this.listeners['request:end'][0];
        listener(this.req, this.res);
        this.resolver.called.should.equal(true);
        this.resolver.calledWith('mock-request-logger').should.equal(true);
    });

    it('should use `info` if no level is defined', function() {
        var opts = {
            enabled: true,
            logger: 'mock-request-logger'
        };

        initializer.init(this.app, this.resolver, opts);
        var listener = this.listeners['request:end'][0];
        listener(this.req, this.res);
        this.log.info.called.should.equal(true);
    });

    it('should use the defined level', function() {
        var opts = {
            enabled: true,
            level: 'ducks',
            logger: 'mock-request-logger'
        };

        this.log.ducks = sinon.spy();
        initializer.init(this.app, this.resolver, opts);
        var listener = this.listeners['request:end'][0];
        listener(this.req, this.res);
        this.log.ducks.called.should.equal(true);
    });

    it('should use the defined formatter', function() {
        var opts = {
            enabled: true,
            formatter: sinon.spy(function() {
                return sinon.spy();
            }),
            logger: 'mock-request-logger'
        };

        initializer.init(this.app, this.resolver, opts);
        var listener = this.listeners['request:end'][0];
        listener(this.req, this.res);
        opts.formatter.called.should.equal(true);
    });

    it('should use the defined request log format', function() {
        var opts = {
            enabled: true,
            format: 'foo',
            logger: 'mock-request-logger'
        };

        initializer.init(this.app, this.resolver, opts);
        var listener = this.listeners['request:end'][0];
        listener(this.req, this.res);
        this.log.info.called.should.equal(true);
        this.log.info.calledWith('foo').should.equal(true);
    });

    it('should use the defined slow log format', function() {
        var opts = {
            enabled: true,
            logger: 'mock-request-logger',
            slow: {
                enabled: true,
                format: 'foo'
            }
        };

        initializer.init(this.app, this.resolver, opts);
        var listener = this.listeners['request:slow'][0];
        listener(this.req, this.res);
        this.log.info.called.should.equal(true);
        this.log.info.calledWith('foo').should.equal(true);
    });

    it('should configure the slow log if it is enabled', function() {
        var opts = {
            enabled: true,
            slow: {
                enabled: true
            }
        };

        initializer.init(this.app, this.resolver, opts);
        this.app.on.called.should.equal(true);
        this.app.on.calledWith('request:slow').should.equal(true);
    });

    it('should not configure the slow log if it is disabled', function() {
        var opts = {
            enabled: true,
            slow: {
                enabled: false
            }
        };

        initializer.init(this.app, this.resolver, opts);
        this.app.on.called.should.equal(true);
        this.app.on.calledWith('request:slow').should.equal(false);
    });
});
