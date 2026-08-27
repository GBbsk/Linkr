const opcoesRefreshCookie = () => {
    return {
        httpOnly: true, // Isso aqui so permite que o token so seja lido durante uma req HTTP
        secure: false, // true: so envia o token se for uma conexao HTTPS
        path: '/', // isso permite que os token sejam enviados para qualquer url da API
        sameSite: 'lax', // usar strict aqui evita CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias em ms
    }
}

const limparRefreshToken = () => {
    return {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'lax' // usar strict aqui evita CSRF
    }
}

module.exports = {
    opcoesRefreshCookie,
    limparRefreshToken
}

