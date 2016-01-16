const AMQP = (config) => {
   return {
      connection: {
         user: config.AMQP_USER,
         pass: config.AMQP_PASSWORD,
         server: [config.AMQP_HOST],
         port: config.AMQP_PORT,
         timeout: 5000,
         replyQueue: false,
         vhost: '%2f',
         publishTimeout: 5000,
      },
      exchanges: [{
         name: 'device.inbound.ex',
         type: 'fanout',
         autoDelete: false,
         persistent: true,
         durable: true,
      }, {
         name: 'device.sensor.ex',
         type: 'fanout',
         autoDelete: false,
         persistent: true,
         durable: true,
      }, {
         name: 'device.inbound.dead.ex',
         type: 'fanout',
         autoDelete: false,
         persistent: true,
         durable: true,
      }],
      queues: [{
         name: 'device.inbound.q',
         autoDelete: false,
         subscribe: false,
         durable: true,
         noBatch: true,
         deadLetter: 'device.inbound.dead.ex',
         limit: 20,
         exclusive: false,
         noAck: false,
      }, {
         name: 'device.inbound.dead.q',
         autoDelete: false,
         subscribe: false,
         durable: true,
         exclusive: false,
      }, {
         name: 'device.sensor.q',
         autoDelete: false,
         subscribe: false,
         durable: true,
         exclusive: false,
      }],
      bindings: [{
         exchange: 'device.inbound.ex',
         target: 'device.inbound.q',
      }, {
         exchange: 'device.inbound.dead.ex',
         target: 'device.inbound.dead.q'
      }, {
         exchange: 'device.sensor.ex',
         target: 'device.sensor.q',
      }]
   }
}

const Config = AMQP({
   AMQP_USER: 'guest',
   AMQP_PASSWORD: 'guest',
   AMQP_HOST: '192.168.99.100',
   AMQP_PORT: '5672'
})

module.exports = Config
