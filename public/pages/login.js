import { fazerLogin } from "../js/api/auth.api.js";

const initLogin = async () => {
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
            const request = await fazerLogin(dados);
            // console.log(request.accessToken) //

            sessionStorage.setItem('accessToken', request.accessToken)
            
            infoPainel.innerHTML = 'Cadastro realizado com sucesso!';
            
            window.location.replace('./feed.html')
            return
        } catch (error) {
            infoPainel.innerHTML = error.message;
            console.error(error);
        }
    })
}

initLogin()