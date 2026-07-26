require('dotenv').config()
const crypto = require('crypto')

const JWT = require('jsonwebtoken')

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

if(!ACCESS_SECRET || ACCESS_SECRET.length < 32){
    throw new Error('JWT_ACCESS_SECRET invalido ou ausente (minimo 32 caracteres)')
}

if(!REFRESH_SECRET || REFRESH_SECRET.length < 32){
    throw new Error('JWT_REFRESH_SECRET invalido ou ausente (minimo 32 caracteres)')
}

const gerarAccessToken = (usuario) => {
    return JWT.sign(
        {
            id: usuario.id,
            name: usuario.name
        }, ACCESS_SECRET, {
            expiresIn: '15m'
        }
    )
}

const gerarRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex') // retorna uma string random de 80 caracteres em Hexadecimal
}

const verificarAccessToken = (token) => {
    return JWT.verify(token, ACCESS_SECRET)
}

const gerarTokenOpaco = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex')
}

module.exports = {
    gerarAccessToken,
    gerarRefreshToken,
    verificarAccessToken,
    gerarTokenOpaco
}