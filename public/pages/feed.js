import { posts } from "../js/api/posts.api.js";

const infoPainel = document.querySelector('.info-feed');
const template = document.getElementById('template-post');
const listaPosts = document.querySelector('.post-feed ol');

const initFeed = async () => {
    if (infoPainel) infoPainel.innerHTML = 'CARREGANDO...';

    try {
        const dados = await posts();
        console.log('Posts recebidos:', dados);
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

        clone.querySelector('.titulo-post-feed a').textContent = post.titulo;
        clone.querySelector('.titulo-post-feed a').href = post.url || '#';
        clone.querySelector('.desc-post-feed').textContent = post.descricao
        clone.querySelector('.info-feed-post').textContent = `${post.votos} likes - @${post.autor}`

        fragment.appendChild(clone)
    });
    listaPosts.replaceChildren(fragment)
}

initFeed();