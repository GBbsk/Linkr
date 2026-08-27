const path = require('path')

const crypto = require('crypto')
const { AppError } = require('../utils/appError')

const postsRepository = require('../repositories/posts.repository')

const buscarPosts = async (filtros) => {
	return await postsRepository.posts(filtros)
}

const status = async () => {
	return await postsRepository.stats()
}

const criarPost = async (dadosDoPost) => {
	const { titulo, url, descricao, tags, autor } = dadosDoPost

	const urlExistente = await postsRepository.checarUrlExiste(url)

	try {
		
		const respostaDeErro = { erro: 'Dados invalidos', detalhes: [] }
	
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
	
		if (!titulo || titulo.length < 5 || titulo.length > 200) {
			respostaDeErro.detalhes.push({
				campo: 'titulo',
				mensagem: 'O tamanho do titulo não pode ser menor que 5 caracteres ou ultrapassar 200 caracteres'
			})
		}
	
		if (descricao !== undefined && descricao.length > 500) {
			respostaDeErro.detalhes.push({
				campo: 'descricao',
				mensagem: 'Descrição é limitada em 500 caracteres'
			})
		}
	
		if (tags !== undefined) {
			if (!Array.isArray(tags)) {
				respostaDeErro.detalhes.push({
					campo: 'tags',
					mensagem: 'O campo tags deve ser uma lista (array).'
				})
			} else if (tags.length > 5) {
				respostaDeErro.detalhes.push({
					campo: 'tags',
					mensagem: 'Você só pode enviar no máximo 5 tags por post.'
				})
			} else {
				const regexValida = /^[a-z0-9-]+$/
				const todasAsTagsSaoValidas = tags.every((tag) => typeof tag === 'string' && tag.length <= 20 && regexValida.test(tag))
				if (!todasAsTagsSaoValidas) {
					respostaDeErro.detalhes.push({
						campo: 'tags',
						mensagem: 'Cada tag deve ter no máximo 20 caracteres e conter apenas letras minúsculas, números e hífens.'
					})
				}
			}
		}
	
		if (!autor || autor.length < 2 || autor.length > 20) {
			respostaDeErro.detalhes.push({
				campo: 'autor',
				mensagem: 'Conter um autor é obrigatorio e o seu nome tem que ser entre 2 e 20 caracteres'
			})
		}
	} catch (error) {
		return false
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
			throw new AppError('Usuario nao autorizado', 403)
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

const votarService = async (postID, userID) => {
	try {
		const postVotado = await postsRepository.votarRepo(postID, userID)

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
