const _ = require('lodash')

const Rabbit = require('wascally')
const Config = require('./config')

const brokerFns = {}

const configurePromise = new Promise(resolve => {
   Rabbit.nackOnError()

   Rabbit.configure(Config)
   .then(() => {
      console.info('Connected to AMQP server.')
      resolve(null)
   }, e => {
      console.error(`Failed to connect to AMQP server. ${e.message} ${e.stack}`)
      resolve(null) // We only care that configuration is done always resolve
   })
})

const subscriptions = {}

const subscribe = (exchange, messageType) => {
   if (subscriptions[messageType]) {
      return
   }

   subscriptions[messageType] = true

   const subscribeTo = _.chain(Config.bindings)
   .filter(x => {
      return x.exchange === exchange
   })
   .map('target')
   .value()

   subscribeTo.forEach(x => {
      Rabbit.startSubscription(x)
   })
}

const createBroker = (exchange, messageType) => {
   return {
      publish(msg) {
         return Rabbit.publish(exchange, messageType, msg)
         .then(() => msg)
      },
      handle(callback) {
         const handler = Rabbit.handle(messageType, callback)
         subscribe(exchange, messageType)
         return handler
      }
   }
}

const registerBroker = (exchange, messageType) => {
   return configurePromise.then(createBroker.bind(undefined, exchange, messageType))
}

registerBroker('device.inbound.ex', 'device.inbound')
registerBroker('device.sensor.ex', 'device.sensor')

module.exports = {
   create: registerBroker
}
