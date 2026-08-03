const crypto = require('crypto')

const { auth } = require('../middlewares/auth')
const { gerarAccessToken, gerarRefreshToken, verificarAccessToken, verificarRefreshToken } = require('../utils/jwt')
const { validarForcaSenha, hashSenha, verificarSenhaHash, fakeBcryptDelay } = require('../utils/senha')
const { saveRefreshToken, revokeRefreshToken } = require('../repositories/refresh-token.repository')
const { criarUsuario, buscarEmail } = require('../repositories/auth.repository')
const { ref } = require('process')
const { AppError } = require('../utils/appError')

const registrarUsuario = async (usuario) => {
        const { nome, email, senha } = usuario
    
        if(!nome || !email || !senha){
            throw new Error('NOME_EMAIL_SENHA_FALTANDO')
        };
    
        const verificarSenha = validarForcaSenha(senha)
    
        if(verificarSenha.length > 0){
            throw new AppError('SENHA_FRACA', verificarSenha)
        };
    
        const senhaHash = await hashSenha(senha)

        const id = crypto.randomUUID()
    
        const novoUsuario = await criarUsuario(
            id, nome, email, senhaHash
        )
    
        const accessToken = await gerarAccessToken(novoUsuario)
        const refreshToken = await gerarRefreshToken(novoUsuario)
    
        await saveRefreshToken(novoUsuario.id, refreshToken)
    
        return { novoUsuario, accessToken, refreshToken }
}

const fazerLogin = async (dados) => {
    const { email, senha } = dados

    if(!email || !senha){
        throw new Error('EMAIL_E_SENHA_SAO_OBRIGATORIOS')
    }

    const usuario = await buscarEmail(email)

    const senhaValida = usuario 
    ? await verificarSenhaHash(senha, usuario.password)
    : await fakeBcryptDelay()
    
    if(!usuario || !senhaValida){
        throw new Error('EMAIL_OU_SENHA_INCORRETOS')
    }
    
    const accessToken = gerarAccessToken(usuario)
    const refreshToken = gerarRefreshToken(usuario)

    await saveRefreshToken(usuario.id, refreshToken)

    return { usuario, accessToken, refreshToken }
}

const logout = async (refreshToken) => {
    if(!refreshToken){
        throw new Error('REFRESH_TOKEN_INVALIDO')
    }

    const revogando = await revokeRefreshToken(refreshToken)

    if(!revogando){
        throw new Error('NAO_FOI_POSSIVEL_FAZER_O_LOGOUT')
    }

    return true
}

module.exports = {
    registrarUsuario,
    fazerLogin,
    logout
}