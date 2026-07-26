const { gerarAccessToken, verificarAccessToken } = require('../utils/jwt')

const token = gerarAccessToken({id: 1, name: 'Gabriel teste'},
)

console.log('TOKEN:', token)

const payload = verificarAccessToken(token)

console.log('PAYLOAD:', payload)

// const testeTokenErrado = verificarAccessToken('token-invalido')

const [, payloadBase64] = token.split('.')

const decodificado = Buffer.from(payloadBase64, 'base64').toString()

console.log('token decodificado, nao passa nada importante no payload:', JSON.parse(decodificado))