var sinon = require('sinon')
var assert = require('assert')
var relaylib = require('../dist/index')

suite('module init', function () {

    test('emit ready event', function (done) {
        var relay = relaylib.use({}, [1,2,3])

        relay.on('ready', function () {
            done()
        })
    })

    test('calls callback if provided', function (done) {
        var callback = function () {
            done();
        }
        var relay = new relaylib.Relay({}, [1,2,3], callback)
    })

})

suite('methods', function () {

    var port = {
        pin: [
            {},{},{},{},{},{},{},{}
        ]
    }

    setup(function () {

        port.pin.map(function (obj) {
            obj.write = function() {}
            sinon.stub(obj, "write")
            return obj
        })

    })

    teardown(function () {
        port.pin.map(function (obj) {
            obj.write.restore()
            return obj
        })
    })

    test('getState', function (done) {
        var relay = relaylib.use(port, [1,2,3])

        var callback = function (err, state) {
            if (err) return done(err)

            assert(!state)
            done()
        }

        relay.getState(2, callback)
    })

    test('setState', function (done) {
        var relay = relaylib.use(port, [1,2,3])

        var callback = function (err, state) {
            if (err) return done(err)

            assert(state)
            done()
        }

        relay.setState(2, true, function () {
            sinon.assert.calledOnce(port.pin[1].write)
            sinon.assert.calledWithExactly(port.pin[1].write, 1)
            relay.getState(2, callback)
        })

    })

    test('toggle', function (done) {
        var relay = relaylib.use(port, [1,2,3])

        var callback = function (err, state) {
            if (err) return done(err)

            assert(state)
            done()
        }

        relay.toggle(3, function () {
            sinon.assert.calledOnce(port.pin[2].write)
            sinon.assert.calledWithExactly(port.pin[2].write, 1)
            relay.getState(3, callback)
        })

    })

    test('turnOn', function (done) {
        var relay = relaylib.use(port, [1,2,3,4])
        var callback = function (err, state) {
            if (err) return done(err)

            assert(state)
            done()
        }
        relay.turnOn(4, function () {
            sinon.assert.calledOnce(port.pin[3].write)
            sinon.assert.calledWithExactly(port.pin[3].write, 1)
            relay.getState(4, callback)
        })

    })

    test('turnOff', function (done) {
        var relay = relaylib.use(port, [1,2,3,4])
        var callback = function (err, state) {
            if (err) return done(err)

            assert(!state)
            done()
        }
        relay.turnOn(1, function () {
            port.pin[0].write.reset()

            relay.turnOff(1, function () {

                sinon.assert.calledOnce(port.pin[0].write)
                sinon.assert.calledWithExactly(port.pin[0].write, 0)

                relay.getState(1, callback)
            })
        })
    })

})