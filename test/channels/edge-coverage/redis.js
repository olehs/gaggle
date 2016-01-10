var RedisChannel = require('../../../channels/redis-channel')
  , uuid = require('uuid')
  , test = require('tape')

test('redis channel - fails options validation', function (t) {
  t.throws(function () {
    /*eslint-disable no-unused-vars*/
    var c = new RedisChannel({
      id: uuid.v4()
    })
    /*eslint-enable no-unused-vars*/
  }, /Invalid options: "channelOptions" is required/, 'Should throw if missing redisChannel')

  t.end()
})

test('redis channel - connects with custom connection string', function (t) {
  var c

  t.plan(3)

  t.doesNotThrow(function () {
    c = new RedisChannel({
      id: uuid.v4()
    , logFunction: console.error
    , channelOptions: {
        redisConnectionString: 'redis://127.0.0.1'
      , redisChannel: 'dummy;neverused'
      }
    })
  }, 'Should not throw')

  c.once('disconnected', function () {
    t.pass('disconnected')
  })

  c.once('connected', function () {
    t.pass('connected')

    c.disconnect()
  })

  c.connect()
})
