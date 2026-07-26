const path = require('path')
const fs = require('fs').promises

const ler = async (caminhoDB, defaultValue = []) => {
	try {
		const conteudo = await fs.readFile(caminhoDB, 'utf-8')
		if (!conteudo.trim()) return defaultValue
		return JSON.parse(conteudo)
	} catch (error) {
		if (error.code === 'ENOENT') {
			return defaultValue
		}

		if (error instanceof SyntaxError) {
			throw new Error(`Arquivo de dados corrompido em ${caminhoDB}: ${error.message}`)
		}
		throw error
	}
}

module.exports = { ler }
