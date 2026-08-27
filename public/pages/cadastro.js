import { cadastrarUsuario } from "../js/api/auth.api.js";

const initCadastrar = () => {
    const loading = document.querySelector('.loading');
    const form = document.querySelector('form');

    const nomeInput = document.querySelector('.username-cadastro');
    const senhaInput = document.querySelector('.password-cadastro');
    const emailInput = document.querySelector('.email-cadastro');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dados = {
            nome: nomeInput.value.trim(),
            email: emailInput.value.trim(),
            senha: senhaInput.value.trim()
        };

        const { nome, email, senha } = dados;
        if (!nome || !email || !senha) {
            loading.innerHTML = 'FALTA DADOS, nome email e senha são obrigatórios!';
            return;
        }

        loading.innerHTML = 'CARREGANDO...';

        try {
            const request = await cadastrarUsuario(dados);
            sessionStorage.setItem('accessToken', request.accessToken)
            
            loading.innerHTML = 'Cadastro realizado com sucesso!';
            
            window.location.replace('./feed.html')
            return
        } catch (error) {
            loading.innerHTML = error.message;
            console.error(error);
        }
    });
};

initCadastrar();