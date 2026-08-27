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

		if (!token) {
            return res.status(401).json({
                erro: 'Formato inválido. Use: Bearer <token>'
            })
        }
		
		const payloadDecodificado = verificarAccessToken(token)

		req.usuario = payloadDecodificado
		
		next()
	} catch (error) {
		if(error.name === 'TokenExpiredError'){
			return res.status(401).json({erro: 'Token expirado, faça login novamente!',
				codigo: 'TOKEN_EXPIRADO'
			})
		}

		return res.status(401).json({ erro: 'Token inválido ou adulterado.' });
	}
}

module.exports = {
	auth
}
