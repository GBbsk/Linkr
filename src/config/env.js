require('dotenv').config()

const VARIAVEIS_ENV_OBRIGATORIAS = ['PORT', 'NODE_ENV', 'JWT_TOKEN']
const VARIAVEIS_FALTANDO = VARIAVEIS_ENV_OBRIGATORIAS.filter((v) => !process.env[v])

if (VARIAVEIS_FALTANDO.length > 0) {
	console.error('Variaveis de ambiente faltando:', VARIAVEIS_FALTANDO.join(', '))
	process.exit(1)
}

module.exports = {
	port: Number(process.env.PORT) || 3000,
	nodeEnv: process.env.NODE_ENV || 'development',
	isDevelopment: process.env.NODE_ENV === 'development',
	isProduction: process.env.NODE_ENV === 'production',
	databaseUrl: process.env.DATABASE_URL,
	jwtSecret: process.env.JWT_SECRET
}
