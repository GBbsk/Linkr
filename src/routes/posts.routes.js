const { Router } = require('express')
const crypto = require('crypto')

const { auth } = require('../middlewares/auth')
const postsService = require('../services/posts.service')

const { validarCamposPost, validarCamposPatch } = require('../middlewares/validarCampos')

const asyncHandler = require('../middlewares/asyncHandler')

const router = Router()

router.get('/', async (req, res) => {
	const resultado = await postsService.buscarPosts({ ...req.query, ...req.body })

	res.json(resultado)
})

router.get('/stats', async (req, res) => {
	const statsPosts = await postsService.status()

	res.json(statsPosts)
})

router.post('/', auth, validarCamposPost, asyncHandler (async (req, res) => {
		const resultado = await postsService.criarPost(req.body)

		if (!resultado.sucesso) {
			return res.status(409).json(resultado.erros)
		}

		res.status(201).json(resultado.post)
	})
)

router.get('/tags', async (req, res) => {
	const tagsUnicasETotal = postsService.tags()

	res.json(tagsUnicasETotal)
})

router.param('id', async (req, res, next, id) => {
	try {
		const postResult = await postsService.buscarID(id)
		req.post = postResult

		next()
	} catch (error) {
		if (error.message === 'POST_NAO_ENCONTRADO') {
			return res.status(404).json({
				error: 'Nenhum post encontrado!'
			})
		}

		return res.status(500).json({ error: 'Erro interno no servidor!' })
	}
})

router.get('/:id', (req, res) => {
	res.json(req.post)
})

router.patch('/:id', auth, validarCamposPatch, async (req, res) => {
	try {
		const post = await postsService.atualizarPost(req.post.id, req.body)

		res.status(200).json(post)
	} catch (error) {
		if (error.message === 'ERRO_AO_ATUALIZAR_POST') {
			return res.status(404).json({
				error: 'Não foi possivel atualizar o post!'
			})
		}

		return res.status(500).json({
			error: 'Erro interno no servidor, tente novamente mais tarde!'
		})
	}
})

router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await postsService.deletar(req.post.id)

		res.status(204).send()
	} catch (error) {
		if (error.message === 'ERRO_AO_DELETAR_POST') {
			return res.status(404).json({
				error: 'Não foi possivel deletar o post, tente novamente mais tarde!'
			})
		}

		return res.status(500).json({
			error: 'Erro interno no servidor, tente novamente mais tarde!'
		})
	}
})

router.post('/:id/votar', async (req, res) => {
	try {
		const votar = await postsService.votarService(req.post.id)

		res.status(200).json(votar)
	} catch (error) {
		if (error.message === 'ERRO_AO_VOTAR') {
			return res.status(404).json({
				error: 'Não foi possivel votar, tente novamente mais tarde!'
			})
		}

		return res.status(500).json({
			error: 'Erro interno no servidor, tente novamente mais tarde!'
		})
	}
})

router.post('/:id/desvotar', async (req, res) => {
	try {
		const desvotar = await postsService.desvotarService(req.post.id)

		res.status(200).json(desvotar)
	} catch (error) {
		if (error.message === 'ERRO_AO_DESVOTAR') {
			return res.status(404).json({
				error: 'Não foi possivel retirar seu voto, tente novamente mais tarde!'
			})
		}

		return res.status(500).json({
			error: 'Erro interno no servidor, tente novamente mais tarde!'
		})
	}
})

router.all('/*any', (req, res) => {
	res.status(404).json({
		error: `Rota: ${req.method} ${req.path} não existe!`
	})
})

module.exports = router
