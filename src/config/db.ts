import { createConnection } from 'typeorm'

export default async () =>
  await createConnection({
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [],
    synchronize: process.env.NODE_ENV === 'development',
    // logging: true,
    // logger: 'simple-console',
  })
