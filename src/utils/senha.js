const bcrypt = require('bcrypt')

const validarForcaSenha = (senha) => {
    const erros = []

    if(senha.length < 8) erros.push('Minimo de 8 caracteres!')
    if(!/[A-Z]/.test(senha)) erros.push('pelo menos uma letra maiúscula!')
    if(!/[0-9]/.test(senha)) erros.push('pelo menos um número!')

    return erros
}

const hashSenha = async (senhaLimpa) => {
    const saltRounds = 10
    return await bcrypt.hash(senhaLimpa, saltRounds)
}

const verificarSenhaHash = async (senhaDigitada, hashDoBanco) => {
    return await bcrypt.compare(senhaDigitada, hashDoBanco)
}

const fakeBcryptDelay = async () => {
    await bcrypt.hash('senha_aleatoria_so_pra_gastar_tempo', 10); // isso serve para previnir time attack
}



module.exports = {
    validarForcaSenha,
    hashSenha,
    verificarSenhaHash,
    fakeBcryptDelay
}