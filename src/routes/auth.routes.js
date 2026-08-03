const { Router } = require('express')

const asyncHandler = require('../middlewares/asyncHandler')
const { opcoesRefreshCookie, limparRefreshToken } = require('../config/cookies')
const { registrarUsuario, fazerLogin, logout } = require('../services/auth.service')
const { verifyRefreshToken, revokeRefreshToken, saveRefreshToken } = require('../repositories/refresh-token.repository')
const { gerarAccessToken, gerarRefreshToken } = require('../utils/jwt')
const { auth } = require('../middlewares/auth')
const { buscarPorId } = require('../repositories/auth.repository')

const router = Router()

router.post('/register', asyncHandler(async (req, res) => {
    const { novoUsuario, refreshToken, accessToken } = await registrarUsuario(req.body)

    res.cookie('refreshToken', refreshToken, opcoesRefreshCookie())

    res.status(201).json({
        mensagem: 'Usuario registrado com sucesso!',
        novoUsuario,
        accessToken
    })
}))

router.post('/login', asyncHandler(async (req, res) => {
    const { usuario, refreshToken, accessToken } = await fazerLogin(req.body)

    res.cookie('refreshToken', refreshToken, opcoesRefreshCookie())

    res.status(201).json({
        mensagem: 'Usuario logado com sucesso!',
        usuario,
        accessToken
    })
}))

router.post('/logout', asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    await logout(refreshToken)

    res.clearCookie('refreshToken', limparRefreshToken())
    res.json({ mensagem: 'Logout realizado com sucesso' })
}))

router.get('/refresh', asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken

    if(!token){
        return res.status(401).json({
            erro: 'Refresh token inválido ou ausente!'
        })
    }
    
    const tokenNoBanco = await verifyRefreshToken(token)
    
    if(!tokenNoBanco){
        res.clearCookie('refreshToken', limparRefreshToken())
        return res.status(401).json({
            erro: 'Sessão encerrada. Faça login novamente.'
        })
    }

    await revokeRefreshToken(token)

    const novoRefreshToken = gerarRefreshToken()
    const novoAccessToken = gerarAccessToken({id: tokenNoBanco.usuario_id})

    await saveRefreshToken(tokenNoBanco.usuario_id, novoRefreshToken)

    res.cookie('refreshToken', novoRefreshToken, opcoesRefreshCookie())

    return res.status(200).json({
        accessToken: novoAccessToken
    })
}))

router.get('/me', auth, asyncHandler(async(req, res) => {
    const usuario = await buscarPorId(req.usuario.id)

    if(!usuario){
        return res.status(404).json({
            erro: 'Usuário não encontrado'
        })
    }

    res.json({
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        criadoEm: usuario.criado_em
    })
}))


module.exports = router