const path = require('path')

const { conectar } = require('../database/connectionDB')
const { cursorTo } = require('readline')
const { url } = require('inspector')

const posts = async (filtros = {}) => {
	const db = await conectar()

	const { autor, tag, busca, ordenar, limite } = filtros || {}

	const dadosParametrizados = []

	let query = 'SELECT * FROM posts WHERE 1=1'

	if (autor) {
		query += ' AND autor = ?'
		dadosParametrizados.push(autor)
	}

	if (tag) {
		query += ' AND tags LIKE ?'
		dadosParametrizados.push(`%${tag}%`)
	}

	if (busca) {
		query += ' AND (titulo LIKE ? OR descricao LIKE ?)'

		const termoBusca = `%${busca.toLowerCase()}%`
		dadosParametrizados.push(termoBusca, termoBusca)
	}

	if (ordenar && ordenar != null) {
		const parametrosDeOrdenacaoPermitidos = {
			votos: 'popular',
			criadoEm: 'criadoEm'
		}
		const campo = parametrosDeOrdenacaoPermitidos[ordenar] || 'criadoEm'

		query += ` ORDER BY ${campo} DESC`
	}

	if (limite && Number.isInteger(Number(limite))) {
		query += ' LIMIT ?'

		dadosParametrizados.push(Number(limite))
	}

	return db.all(query, dadosParametrizados)
}

const stats = async () => {
	const db = await conectar()

	const [totais, postMaisVotado, tagMaisUsada, autorComMaisPost] = await Promise.all([
		await db.get(`SELECT COUNT(id) AS totalPosts, SUM(votos) AS totalVotos, AVG(votos) AS mediaVotos FROM posts`),
		await db.get(`SELECT COUNT(id) AS totalPosts, SUM(votos) AS totalVotos, AVG(votos) AS mediaVotos FROM posts`),
		await db.get(` SELECT value AS tag, COUNT(*) AS total FROM posts, json_each(posts.tags) GROUP BY tag ORDER BY total DESC LIMIT 1`),
		await db.get(`SELECT autor, COUNT(*) as total FROM posts GROUP BY autor ORDER BY total DESC LIMIT 1`)
	])

	return {
		totalPosts: totais.totalPosts || 0,
		totalVotos: totais.totalVotos || 0,
		mediaVotos: totais.mediaVotos || 0,
		postMaisVotado,
		tagMaisUsada,
		autorMaisAtivo: autorComMaisPost
	}
}

const checarUrlExiste = async (url) => {
	const db = await conectar()

	return await db.get('SELECT id FROM posts WHERE url = ?', [url])
}

const salvar = async (post) => {
	const db = await conectar()

	const tagsParaSQLite = JSON.stringify(post.tags)

	await db.run(
		`INSERT INTO posts (id, titulo, url, descricao, tags, autor, votos, criadoEm) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		[post.id, post.titulo, post.url, post.descricao, tagsParaSQLite, post.autor, post.votos, post.criadoEm]
	)
}

const buscarTags = async () => {
	const db = await conectar()

	const tagsUnicasETotal = await db.all(`
        SELECT value AS tag,
        COUNT(*) AS total
        FROM posts, json_each(posts.tags)
        GROUP BY tag
        ORDER BY total DESC
    `)
	return tagsUnicasETotal
}

const buscarID = async (id) => {
	try {
		const db = await conectar()

		const resultadoPostID = await db.get('SELECT * FROM posts WHERE id = ?', [id])

		if (!resultadoPostID) {
			return null
		}

		return resultadoPostID
	} catch (error) {
		throw new Error('ERRO_AO_BUSCAR_POST_ID_BANCO')
	}
}

const atualizarPost = async (id, dadosAtualizados) => {
	try {
		const db = await conectar()

		const post = await db.get('SELECT * FROM posts WHERE id = ?', [id])

		const colunasParaAtualizar = Object.keys(dadosAtualizados)
			.map((chave) => `${chave} = ?`)
			.join(', ')

		const params = Object.values(dadosAtualizados)

		params.push(id)

		const sql = `UPDATE posts SET ${colunasParaAtualizar} WHERE id = ? RETURNING *`

		const update = await db.get(sql, params)

		if (!update) {
			return false
		}

		return update
	} catch (error) {
		throw new Error('ERRO_AO_ATUALIZAR_POST_BANCO')
	}
}

const deletarPost = async (id) => {
	try {
		const db = await conectar()

		const resultado = await db.run('DELETE FROM posts WHERE id = ?', [id])

		if (resultado.changes === 0) {
			return false
		}

		return true
	} catch (error) {
		throw new Error('ERRO_AO_DELETAR_POST_BANCO')
	}
}

const votarRepo = async (id) => {
	try {
		const db = await conectar()

		const sql = 'UPDATE posts SET votos = votos + 1 WHERE id = ? RETURNING *'

		const postAtualizado = await db.get(sql, [id])

		if (!postAtualizado) {
			return false
		}

		return postAtualizado
	} catch (error) {
		throw new Error('ERRO_AO_VOTAR_BANCO')
	}
}

const desvotarRepo = async (id) => {
	try {
		const db = await conectar()

		const sql = 'UPDATE posts SET votos = votos - 1 WHERE id = ? RETURNING *'

		const postAtualizado = await db.get(sql, [id])

		if (!postAtualizado) {
			return false
		}

		return postAtualizado
	} catch (error) {
		throw new Error('ERRO_AO_DESVOTAR_BANCO')
	}
}

module.exports = {
	posts,
	salvar,
	buscarID,
	atualizarPost,
	buscarTags,
	stats,
	checarUrlExiste,
	deletarPost,
	votarRepo,
	desvotarRepo
}
