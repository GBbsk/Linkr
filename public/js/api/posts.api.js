
const BASE_URL_POST = 'http://localhost:3000/api/v1/posts'
const BASE_URL_AUTH = 'http://localhost:3000/api/v1/auth'

const posts = async () => {
    const response = await fetch(`${BASE_URL_POST}`, {
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

const curtirPost = async (postID, accessToken) => {
    const response = await fetch(`${BASE_URL_POST}/${postID}/votar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include'
    })

    if (!response.ok) {
        const erro = await response.json()
        console.log('Erro completo da API:', erro)  
        
        if (response.status === 401 && erro.codigo === 'TOKEN_EXPIRADO') {
            const novoToken = await renovarToken()

            if (!novoToken) {
                window.location.replace('./login.html')
                return
            }

            return curtirPost(postID, novoToken)
        }

        throw new Error(erro.erro || 'Erro ao curtir o post!')
    }

    return response.json()
}


const renovarToken = async () => {
    const response = await fetch(`${BASE_URL_AUTH}/refresh`, {
        method: 'POST',
        credentials: 'include' 
    })

    if (!response.ok) return null

    const dados = await response.json()
    sessionStorage.setItem('accessToken', dados.accessToken)

    return dados.accessToken
}
export {
    posts,
    curtirPost
}