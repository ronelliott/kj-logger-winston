'use strict';

var should = require('should'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire'),
    reflekt = require('reflekt'),
    initializer = require('../app-logging');

describe('app-logging', function() {
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


        this.resolver = sinon.spy(new reflekt.ObjectResolver({
            'mock-app-logger': this.log
        }));
    });

    it('should resolve the logger', function() {
        var opts = {
            enabled: true,
            logger: 'mock-app-logger'
        };

        initializer.init(this.app, this.resolver, opts);
        var listener = this.listeners['app:start'][0];
        listener(this.req, this.res);
        this.resolver.called.should.equal(true);
        this.resolver.calledWith('mock-app-logger').should.equal(true);
    });

    it('should use the defined formatter', function() {
        var opts = {
            enabled: true,
            formatter: sinon.spy(function() {
                return sinon.spy();
            }),
            logger: 'mock-app-logger'
        };

        initializer.init(this.app, this.resolver, opts);
        var listener = this.listeners['app:start'][0];
        listener(this.req, this.res);
        opts.formatter.called.should.equal(true);
    });

    it('should use the defined log format', function() {
        var opts = {
            enabled: true,
            format: 'foo',
            logger: 'mock-app-logger'
        };

        initializer.init(this.app, this.resolver, opts);
        var listener = this.listeners['app:start'][0];
        listener(this.req, this.res);
        this.log.info.called.should.equal(true);
        this.log.info.calledWith('foo').should.equal(true);
    });
});
