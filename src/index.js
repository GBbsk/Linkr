const app = require('./app.js')
require('dotenv').config()

const { executarMigrations } = require('./databaseFunctions/migrations.js')
const { desconectar } = require('./databaseFunctions/connectionDB.js')

const servidor = async () => {
	try {
		await executarMigrations()

		const iniciar = app.listen(process.env.PORT || 3000, () => {
			console.log(`[Servidor rodando] http://localhost:${process.env.PORT || 3000}/api/v1/posts`)
		})

		const encerrar = async () => {
			console.log('Encerrando...')
			await desconectar()

			iniciar.close(() => process.exit(0))
		}

		process.on('SIGTERM', encerrar)
		process.on('SIGINT', encerrar)
	} catch (error) {
		console.error('Erro ao iniciar o servidor:', error)
		process.exit(1)
	}
}

servidor()
