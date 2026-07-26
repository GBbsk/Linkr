const opcoesRefreshCookie = () => {
    return {
        httpOnly: true, // Isso aqui so permite que o token so seja lido durante uma req HTTP
        secure: false, // true: so envia o token se for uma conexao HTTPS
        path: '/api/v1/auth', 
        sameSite: 'strict', // isso aqui evita CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias em ms
    }
}

const limparRefreshToken = () => {
    return {
        httpOnly: true,
        secure: false,
        path: '/api/v1/auth',
        sameSite: 'strict'
    }
}

module.exports = {
    opcoesRefreshCookie,
    limparRefreshToken
}

