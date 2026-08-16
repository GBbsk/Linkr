import { fazerLogin } from "../js/api/auth.api.js";

const initLogin = () => {
    const emailInput = document.querySelector('.email-login')
    const passwordInput = document.querySelector('.password-login')
    const infoPainel = document.querySelector('.info')

    const form = document.querySelector('.form-login')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const dados = {
            email: emailInput.value.trim(),
            senha: passwordInput.value.trim()
        };

        const { email, senha } = dados

        if(!email || !senha){
            infoPainel.innerHTML = 'Dados faltando, email e senha são obrigatorios!'
            return
        }

        infoPainel.innerHTML = 'Carregando...'

        try {
            const request = await fazerLogin(dados)
            console.log(request)
            infoPainel.innerHTML = 'Login realizado com sucesso!'
            return request
        } catch (error) {
            infoPainel.innerHTML = error.message
            console.error(error)
        }
    })
}

initLogin()