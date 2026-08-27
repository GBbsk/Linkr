const BASE_URL = 'http://localhost:3000/api/v1/auth'

const cadastrarUsuario = async (dados) => {
    const {nome, email, senha} = dados;

    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(dados)
    })

    if(!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || 'Erro ao realizar o cadastro.');
    }

    return response.json()
} 

const fazerLogin = async (dados) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(dados)
    })

    if(!response.ok){
        const erro = await response.json();
        throw new Error(erro.erro || 'Erro ao realizar login!')
    }

    return response.json()
}

const fazerLogout = async () => {
    const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
    })

    if(!response.ok){
        const erro = await response.json();
        throw new Error(erro.erro || 'Erro ao realizar logout!')
    }

    return response
}

export {
    cadastrarUsuario,
    fazerLogin,
    fazerLogout
}