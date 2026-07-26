// o caminho raiz do projeto tem que ser passado dessa forma: const caminho = path.join(__dirname, 'aqui-seu-path');
// e as pastas tem que ser passsados dentro de um array
const path = require('path')
const fsPromises = require('fs').promises

const criarArquivosFaltantes = async (itensFaltantes, caminhoAbsoluto) => {
	try {
		console.log(`⚠️  Faltando: ${itensFaltantes} -> Criando automaticamente...`)

		const ehArquivo = path.extname(itensFaltantes) !== ''

		if (ehArquivo) {
			const pastaDoArquivo = path.dirname(caminhoAbsoluto)
			await fsPromises.mkdir(pastaDoArquivo, { recursive: true })

			await fsPromises.writeFile(caminhoAbsoluto, '')
			console.log(`✅ Arquivo criado: ${itensFaltantes}`)
		} else {
			await fsPromises.mkdir(caminhoAbsoluto, { recursive: true })
			console.log(`✅ Pasta criada: ${itensFaltantes}`)
		}
	} catch (error) {
		console.log('Não foi possivel criar os arquivo / pastas!')
	}
}

const verificarPastaEArquivoLog = async (caminhoRaizProjeto, pastasParaVerificar) => {
	const pastas = []

	for (const item of pastasParaVerificar) {
		const caminhoAbsoluto = path.join(caminhoRaizProjeto, item)

		try {
			await fsPromises.access(caminhoAbsoluto)

			pastas.push({
				item: item,
				existe: true
			})
		} catch (error) {
			await criarArquivosFaltantes(item, caminhoAbsoluto)

			pastas.push({
				item: item,
				existe: false,
				tipo: 'Criado agora ✅'
			})
		}
	}

	return pastas
}

module.exports = verificarPastaEArquivoLog
