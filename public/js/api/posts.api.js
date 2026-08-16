const BASE_URL = 'http://localhost:3000/api/v1/posts'

const posts = async () => {

    const response = await fetch(`${BASE_URL}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }, 
    })

    if(!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || 'Erro ao realizar o cadastro.');
    }

    return response.json()
}

export {
    posts
}