const { executarMigrations } = require('../src/database/migrations')
const { conectar, desconectar } = require('../src/database/connectionDB')
const { contentSecurityPolicy } = require('helmet')


require('dotenv').config({ path: 'env.test'})

beforeAll(async () => {
    await executarMigrations()
})

beforeEach(async () => {
    const db = await conectar()
    
    
    await db.run('DELETE FROM refresh_tokens')
    await db.run('DELETE FROM posts')
    await db.run('DELETE FROM usuarios')
})

afterAll(async () => {
    await desconectar()
})