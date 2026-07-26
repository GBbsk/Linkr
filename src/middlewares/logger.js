const fsPromises = require('fs').promises
const path = require('path')

const verificarPastaEArquivoLog = require('../services/verificarLog')

const caminhoRaizProjeto = path.join(__dirname, '../../../exercicio-3')
const logPathFinal = path.join(caminhoRaizProjeto, 'logs', 'requests.log')

const pastasAVerificar = ['logs', 'logs/requests.log']

const logger = (req, res, next) => {
	const initRequest = Date.now()

	// const jsonOriginal = res.json.bind(res)

	res.on('finish', () => {
		const durationRequest = Date.now() - initRequest
		const timestamp = new Date().toISOString()

		const dados = `[${[timestamp]}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationRequest}ms`

		verificarPastaEArquivoLog(caminhoRaizProjeto, pastasAVerificar)
		salvarLogNoArquivo(logPathFinal, dados)
	})
	next()
}

const salvarLogNoArquivo = async (logPath, conteudo) => {
	try {
		await fsPromises.appendFile(logPath, JSON.stringify(conteudo) + '\n', 'utf-8')
		console.log('Arquivo salvo com sucesso em:', logPath)
	} catch (error) {
		console.log(`[ERRO]: ${error}`)
	}
}

module.exports = {
	logger
}
