const path = require('path')

const crypto = require('crypto')

const postsRepository = require('../repositories/posts.repositories')

const buscarPosts = async (filtros) => {
	return await postsRepository.posts(filtros)
}

const status = async () => {
	return await postsRepository.stats()
}

const criarPost = async (dadosDoPost) => {
	const { titulo, url, descricao, tags, autor } = dadosDoPost

	const urlExistente = await postsRepository.checarUrlExiste(url)

	if (urlExistente) {
		return {
			sucesso: false,
			erros: [
				{
					erro: 'Conflito',
					mensagem: 'Já existe um post cadastrado com esta URL.'
				}
			]
		}
	}

	const novoPost = {
		id: crypto.randomUUID(),
		titulo,
		url,
		descricao: descricao || '',
		tags: tags || [],
		autor,
		votos: 0,
		criadoEm: new Date().toISOString()
	}

	await postsRepository.salvar(novoPost)

	return { sucesso: true, post: novoPost }
}

const tags = async () => {
	return await postsRepository.buscarTags()
}

const buscarID = async (id) => {
	try {
		const resultadoBuscarID = await postsRepository.buscarID(id)

		if (!resultadoBuscarID) {
			throw new Error('POST_NAO_ENCONTRADO')
		}

		return resultadoBuscarID
	} catch (error) {
		throw error
	}
}

const atualizarPost = async (id, dados) => {
	try {
		const { titulo, descricao, tags } = dados

		const dadosAtualizados = {
			...(titulo !== undefined && { titulo }),
			...(descricao !== undefined && { descricao }),
			...(tags !== undefined && { tags: JSON.stringify(tags) })
		}

		if (Object.keys(dadosAtualizados).length === 0) {
			throw new Error('NENHUM_DADO_PARA_ATUALIZAR')
		}

		const postUpdate = await postsRepository.atualizarPost(id, dadosAtualizados)

		if (!postUpdate) {
			throw new Error('ERRO_AO_ATUALIZAR_POST')
		}

		return postUpdate
	} catch (error) {
		throw error
	}
}

const deletar = async (id) => {
	try {
		const postDelete = await postsRepository.deletarPost(id)

		if (!postDelete) {
			throw new Error('ERRO_AO_DELETAR_POST')
		}

		return postDelete
	} catch (error) {
		throw error
	}
}

const votarService = async (id) => {
	try {
		const postVotado = await postsRepository.votarRepo(id)

		if (!postVotado) {
			throw new Error('ERRO_AO_VOTAR')
		}

		return postVotado
	} catch (error) {
		throw error
	}
}

const desvotarService = async (id) => {
	try {
		const postDesVotado = await postsRepository.desvotarRepo(id)

		if (!postDesVotado) {
			throw new Error('ERRO_AO_DESVOTAR')
		}

		return postDesVotado
	} catch (error) {
		throw error
	}
}

module.exports = {
	buscarPosts,
	criarPost,
	buscarID,
	atualizarPost,
	status,
	tags,
	deletar,
	votarService,
	desvotarService
}
