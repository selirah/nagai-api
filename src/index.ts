import 'reflect-metadata'
import { __prod__ } from './utils'
import { Connection, createConnection } from 'typeorm'
import { ormconfig } from './ormconfig'
import { config } from './config'
import { server } from './utils/socketio'

const main = async () => {
  await createConnection(ormconfig)
    .then((conn: Connection) => {
      // conn.runMigrations()
      console.log('db connected: ', conn.isConnected)
    })
    .catch((err) => console.log(err))

  server.listen(config.port, () => {
    console.log(`server started and running at localhost:${config.port}`)
  })
}

main().catch((err) => {
  console.log(err)
})
