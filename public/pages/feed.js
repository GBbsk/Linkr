import { posts, curtirPost } from "../js/api/posts.api.js";
import { fazerLogout } from "../js/api/auth.api.js";

const infoPainel = document.querySelector('.info-feed');

const template = document.getElementById('template-post');
const listaPosts = document.querySelector('.post-feed ol');

const initFeed = async () => {
    if (infoPainel) infoPainel.innerHTML = 'CARREGANDO...';

    try {
        const dados = await posts();

        infoPainel.innerHTML = ''

        const listaDePosts = Array.isArray(dados) ? dados : dados.posts;
        renderizarPosts(listaDePosts)
    } catch (error) {
        console.error('Erro ao buscar posts:', error.message);
        if (infoPainel) infoPainel.innerHTML = 'Erro ao carregar posts.';
    }
};

const renderizarPosts = (posts) => {
    const fragment = document.createDocumentFragment();

    if (!posts || posts.length === 0) {
        if (infoPainel) infoPainel.innerHTML = 'Nenhum post encontrado.';
        return;
    }

    posts.forEach(post => {
        const clone = template.content.cloneNode(true)

        clone.querySelector('.post-item').id = post.id;
        clone.querySelector('.titulo-post-feed a').textContent = post.titulo;
        clone.querySelector('.titulo-post-feed a').href = post.url || '#';
        clone.querySelector('.desc-post-feed').textContent = post.descricao
        clone.querySelector('.info-feed-post').textContent = `${post.votos} likes - @${post.autor}`

        fragment.appendChild(clone)
    });
    listaPosts.replaceChildren(fragment)
}

const curtir = () => {
    const btnCurtir = document.querySelectorAll('.btn-curtir')

    if (btnCurtir.length === 0) return;

    btnCurtir.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault()

            const post = btn.closest('.post-item')
            const id = post ? post.id : null;

            if (!id) { console.warn('ID do post não encontrado.');
                return;
            }

            try {
                const accessToken = sessionStorage.getItem('accessToken')

                if (!accessToken) {
                    window.location.replace('./login.html')
                }

                const dados = await curtirPost(id, accessToken)
                await atualizarPost(dados.id, 'curtir')
            } catch (error) {
                console.error('Erro ao curtir post:', error);
                if(error.message === 'Token inválido ou adulterado.'){
                    window.location.replace('./login.html')
                }
            }
        })
    })
}

const atualizarPost = async (postId, estado = 'curtir') => {
    const AllPosts = await posts()

    const post = AllPosts.find(p => p.id === postId)
    const postHTML = document.getElementById(`${post.id}`)

    if(!post){
        throw new Error('POST_NAO_EXISTE')
    }

    const btnCurtir = postHTML.querySelector('.btn-curtir');
    const infoPost = postHTML.querySelector('.info-feed-post');

    if(estado == 'curtir'){
        btnCurtir.classList.add('btn-curtido')
        btnCurtir.style.color = '#ffffff'; 

        
        const textoLikes = post.votos === 1 ? 'like' : 'likes';
        infoPost.textContent = `${post.votos} ${textoLikes} - @${post.autor}`
    }

    btnCurtir.style.backgroundColor = '#f9faf9';
    btnCurtir.style.color = '#1d1c1c'; 
}

const logout = async () => {
    const btnLogout = document.querySelector('.logout-head-nav')

    btnLogout.addEventListener('click', async (e) => {
        e.preventDefault()

    try {
        await fazerLogout()
        window.location.replace('./login.html')
        } catch (error) {
        console.log('CATCH:', error.message)
        throw error
        }
    })
}

const iniciar = async () => {
    await initFeed();    
    curtir() 
    logout()
};

iniciar();

export {
    curtirPost,
};
