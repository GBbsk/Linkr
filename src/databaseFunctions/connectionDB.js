const path = require('path')

const { open } = require('sqlite')

const sqlite3 = require('sqlite3')

const scripts = require('../utils/verifyFilesAndDirectory')
const raizDoProjeto = path.resolve(__dirname, '..', '..')

const DB_PATH = path.join(raizDoProjeto, 'src/database/banco.db')

let db = null

const conectar = async () => {
	if (db) return db

	await scripts.verifyFiles(raizDoProjeto, 'src/database/banco.db')

	db = await open({
		filename: DB_PATH,
		driver: sqlite3.Database
	})

	await db.exec('PRAGMA journal_mode = WAL')

	await db.exec('PRAGMA foreign_keys = ON')

	return db
}

const desconectar = async () => {
	if (db) {
		await db.close()
		db = null
	}
}

module.exports = { conectar, desconectar }
