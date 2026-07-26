const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const verifyFiles = async (caminho, ...arquivos) => {
	for (const item of arquivos) {
		const caminhoAbsoluto = path.join(caminho, item)

		const files = []
		try {
			await fsPromises.access(caminhoAbsoluto)
		} catch (error) {
			await criarArquivosFaltantes(item, caminhoAbsoluto)
		}
	}
}

const criarArquivosFaltantes = async (itensFaltantes, caminhoAbsoluto) => {
	try {
		const arquivo = path.extname(itensFaltantes) !== ''

		if (arquivo) {
			const pastaDoArquivo = path.dirname(caminhoAbsoluto)

			await fsPromises.mkdir(pastaDoArquivo, { recursive: true })
			await fsPromises.writeFile(caminhoAbsoluto, '')
		} else {
			await fsPromises.mkdir(caminhoAbsoluto, { recursive: true })
		}
	} catch (error) {
		throw error('Não foi possivel criar os arquivo / pastas!')
	}
}

module.exports = { verifyFiles }
