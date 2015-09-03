'use strict';

var should = require('should'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire'),
    reflekt = require('reflekt'),
    initializer = require('../loggers');

describe('loggers', function() {
    beforeEach(function() {
        this.winston = {
            loggers: {
                add: sinon.spy(function(name) { return name; }),
                get: sinon.spy(function(name) { return name; })
            }
        };

        this.resolver = sinon.spy(new reflekt.ObjectResolver());
    });

    //it('should attempt to resolve the defined resource', function() {
    //    var opts = { resource: 'foo' };
    //    initializer(opts)(this.app, this.resolver);
    //    this.resolver.called.should.equal(true);
    //    this.resolver.calledWith('foo').should.equal(true);
    //});

    //it('should attempt to resolve "$winston" if no resource is defined', function() {
    //    var opts = {};
    //    initializer(opts)(this.app, this.resolver);
    //    this.resolver.called.should.equal(true);
    //    this.resolver.calledWith('$winston').should.equal(true);
    //});

    it('should register the loggers defined in `loggers`', function() {
        var opts = {
            app: {
                enabled: true,
                options: {}
            }
        };

        initializer.add(this.resolver, this.winston, opts);
        this.winston.loggers.add.called.should.equal(true);
        this.winston.loggers.add.calledWith('app', {}).should.equal(true);
    });

    it('should inject the resolver using the logger name if `inject` is defined as a boolean', function() {
        var opts = {
            app: {
                enabled: true,
                inject: true,
                options: {}
            }
        };

        initializer.add(this.resolver, this.winston, opts);
        this.resolver.items.should.have.property('app');
    });

    it('should inject the resolver using the value in `inject` if it is defined as a string', function() {
        var opts = {
            app: {
                enabled: true,
                inject: 'foo',
                options: {}
            }
        };

        initializer.add(this.resolver, this.winston, opts);
        this.resolver.items.should.have.property('foo');
    });
});
