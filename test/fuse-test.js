/**
    Module: @mitchallen/fuse-svg-path
      Test: smoke-test-factory
    Author: Mitch Allen
*/

"use strict";

var request = require('supertest'),
    should = require('should'),
    modulePath = "../index-factory";

describe('fuse method', function() {

    var _factory = null;

    before(function(done) {
        // Call before all tests
        delete require.cache[require.resolve(modulePath)];
        _factory = require(modulePath);
        done();
    });

    after(function(done) {
        // Call after all tests
        done();
    });

    beforeEach(function(done) {
        // Call before each test
        done();
    });

    afterEach(function(done) {
        // Call after eeach test
        done();
    });

    it('should return fused path', function(done) {
        var obj = _factory.create({});
        should.exist(obj);
        let options = {
            verbose: false,
            path: [
                { op: "M", x: 10, y: 20 },
                { op: "L", x: 30, y: 40 },
                { op: "M", x: 30, y: 40 },
                { op: "L", x: 25, y: 35 }
            ]
        };
        let expected = [
            { op: "M", x: 10, y: 20 },
            { op: "L", x: 30, y: 40 },
            { op: "L", x: 25, y: 35 }
        ];
        var result = obj.fuse(options);
        should.exist(result);
        result.should.eql(expected);
        done();
    });

    it('should fuse reversed path', function(done) {
        var obj = _factory.create({});
        should.exist(obj);
        let options = {
            verbose: false,
            path: [
                { op: "M", x: 10, y: 20 },
                { op: "L", x: 30, y: 40 },
                { op: "M", x: 25, y: 35 },
                { op: "L", x: 30, y: 40 }
            ]
        };
        let expected = [
            { op: "M", x: 10, y: 20 },
            { op: "L", x: 30, y: 40 },
            { op: "L", x: 25, y: 35 }
        ];
        var result = obj.fuse(options);
        should.exist(result);
        result.should.eql(expected);
        done();
    });

    it('should return fused path with middle ops', function(done) {
        var obj = _factory.create({});
        should.exist(obj);
        let options = {
            verbose: false,
            path: [
                { op: "M", x: 10, y: 20 },
                { op: "L", x: 15, y:  5 },
                { op: "L", x: 30, y: 40 },
                { op: "M", x: 30, y: 40 },
                { op: "L", x: 50, y: 55 },
                { op: "L", x: 25, y: 35 }
            ]
        };
        let expected = [
            { op: "M", x: 10, y: 20 },
            { op: "L", x: 15, y:  5 },
            { op: "L", x: 30, y: 40 },
            { op: "L", x: 50, y: 55 },
            { op: "L", x: 25, y: 35 }
        ];
        var result = obj.fuse(options);
        should.exist(result);
        result.should.eql(expected);
        done();
    });

    it('should fuse reversed paths with middle ops', function(done) {
        var obj = _factory.create({});
        should.exist(obj);
        let options = {
            verbose: false,
            path: [
                { op: "M", x: 10, y: 20 },
                { op: "L", x: 15, y:  5 },
                { op: "L", x: 30, y: 40 },
                { op: "M", x: 25, y: 35 },
                { op: "L", x: 50, y: 55 },
                { op: "L", x: 30, y: 40 }
            ]
        };
        let expected = [
            { op: "M", x: 10, y: 20 },
            { op: "L", x: 15, y:  5 },
            { op: "L", x: 30, y: 40 },
            { op: "L", x: 50, y: 55 },
            { op: "L", x: 25, y: 35 }
        ];
        var result = obj.fuse(options);
        should.exist(result);
        result.should.eql(expected);
        done();
    });
});
