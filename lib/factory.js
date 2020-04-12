var Joi = require('@hapi/joi')
  , _ = require('lodash')
  , channels = require('../channels')
  , channelNames = _.keys(channels)
  , prettifyJoiError = require('../helpers/prettify-joi-error')
  , Gaggle = require('./gaggle')
  , schema

/**
* Validate the bare minimum, leave the rest up to the Channel and Gaggle
* constructors to handle.
*/
schema = Joi.object().keys({
  id: Joi.string().required()
, channel: Joi.object().keys({
    name: Joi.string().valid(...channelNames).required()
  }).required()
})


module.exports = function GaggleFactory (opts) {
  var validatedOptions = schema.validate(opts || {}, {allowUnknown: true, stripUnknown: false})
    , channelInst

  if (validatedOptions.error != null) {
    throw new Error(prettifyJoiError(validatedOptions.error))
  }

  opts = validatedOptions.value

  channelInst = new channels[opts.channel.name]({
                  id: opts.id
                , channelOptions: _.omit(opts.channel, 'name')
                })

  return new Gaggle(_.assign({}, opts, {channel: channelInst}))
}

module.exports.enhanceServerForSocketIOChannel = require('./socket-io-server-enhancer.js')

module.exports._STATES = Gaggle._STATES
module.exports._RPC_TYPE = Gaggle._RPC_TYPE
