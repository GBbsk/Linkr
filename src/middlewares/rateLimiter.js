const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowsMs: 15 * 60 * 1000, // janela de tentativas: 15min
    max: 10, // max de tentavias em windowsMS
    message: {
        erro: 'Muitas tentativas de login. Tente novamente mais tarde!'
    },
    standarHeaders: true,
    legacyHeaders: false
})

const apiLimiter = rateLimit({
    windowsMs: 60 * 1000, // janela de 1min
    max: 100,
    message: {
        erro: 'Muitas requisições. Aguarde um momento!'
    },
    standarHeaders: true,
    legacyHeaders: false
})

module.exports = {
    loginLimiter,
    apiLimiter
}