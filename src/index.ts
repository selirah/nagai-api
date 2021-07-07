import 'reflect-metadata'
import { __prod__ } from './utils'
import { Connection, createConnection } from 'typeorm'
import { ormconfig } from './ormconfig'
import { config } from './config'
import { server, io } from './utils/socketio'
import { __Order__ } from './models/__Order__'

const main = async () => {
  await createConnection(ormconfig)
    .then((conn: Connection) => {
      // conn.runMigrations();
      console.log('db connected: ', conn.isConnected)
    })
    .catch((err) => console.log(err))

  io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

    socket.on('PLACE ORDER', (payload: __Order__) => {
      io.emit('PLACE ORDER', payload)
    })
  })
  server.listen(config.port, () => {
    console.log(`server started and running at localhost:${config.port}`)
  })
}

main().catch((err) => {
  console.log(err)
})
