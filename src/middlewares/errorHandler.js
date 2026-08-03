const errorHandler = (error, req, res, next) => {
    try {
        const errorCode = error.code || error.message
        const errorMaping = {
            'NOME_EMAIL_SENHA_FALTANDO': {status: 400, msg: 'Nome, email e senha são campos obrigatórios!'},
            'EMAIL_JA_EXISTE': { status: 409, msg: 'Este e-mail já está em uso. Tente recuperar a senha.' }, 
            'EMAIL_E_SENHA_SAO_OBRIGATORIOS': {status: 400, msg: 'Email e senha são obrigatorios!'},
            'EMAIL_OU_SENHA_INCORRETOS': {status: 401, msg: 'Email ou senha incorretos'},
            'REFRESH_TOKEN_INVALIDO': {status: 400, msg: 'Erro ao fazer logout, refresh token invalido'},
            'USERNAME_JA_EXISTE': { status: 409, msg: 'Este nome de usuário já foi escolhido. Tente outro.' },
            'NAO_FOI_POSSIVEL_FAZER_O_LOGOUT': {status: 400, msg: 'Erro ao fazer logout, tente novamente mais tarde!'},
            'SENHA_FRACA': {status: 401, msg: 'Senha fraca.'}
        }
        
        if(errorMaping[errorCode]){
            const errorDetail = errorMaping[errorCode]
            const mensagem = Array.isArray(error.detalhes)
                ? error.detalhes.join(' ')
                : (error.detalhes || errorDetail.msg)

            return res.status(errorDetail.status).json({ erro: mensagem })
        }
        

        console.error(`[ERRO NÃO MAPEADO] ${error.message}`)
        return res.status(500).json({ erro: 'Erro interno no servidor. Tente novamente mais tarde.' })

    } catch (internalError) {
        console.error(`[ERRO NO ERROR HANDLER] ${internalError.message}`)
        res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
}

module.exports = {
    errorHandler
 }