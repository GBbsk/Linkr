const { verifyRefreshToken } = require('../repositories/refresh-token.repository')
const { gerarTokenOpaco, verificarAccessToken } = require('../utils/jwt')


const auth = (req, res, next) => {
	try {
		const headers = req.headers['authorization'] || req.headers['Authorization']
	
		if (!headers) {
			return res.status(401).json({
				erro: 'Acesso negado. Token não fornecido.'
			})
		}
	
		const token = headers.split(' ')[1]
		
		const payloadDecodificado = verificarAccessToken(token)

		req.usuario = payloadDecodificado
		
		next()
	} catch (error) {
		if(error.name === 'TokenExpiredError'){
			return res.status(401).json({erro: 'Token expirado, faça login novamente!'})
		}

		return res.status(401).json({ erro: 'Token inválido ou adulterado.' });
	}
}

module.exports = {
	auth
}
