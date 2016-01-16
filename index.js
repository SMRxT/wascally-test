'use-strict';

const Rabbit = require('wascally')
const Config = require('./config')
const Broker = require('./broker')

const RunApp = () => {
   Broker.create('device.inbound.ex', 'device.inbound')
   .then(broker => {
      setInterval(() => {
         broker.publish(new Date().toString())
      }, 1000)

      broker.handle(msg => {
         console.log(msg.body)
         msg.ack()
      })
   })
}

RunApp()
