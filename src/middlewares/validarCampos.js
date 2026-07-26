const validarCamposPost = (req, res, next) => {
	const { titulo, url, descricao, tags, autor } = req.body
	const respostaDeErro = { erro: 'Dados invalidos', detalhes: [] }

	if (!titulo || titulo.length < 5 || titulo.length > 200) {
		respostaDeErro.detalhes.push({
			campo: 'titulo',
			mensagem: 'O tamanho do titulo não pode ser menor que 5 caracteres ou ultrapassar 200 caracteres'
		})
	}

	if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
		respostaDeErro.detalhes.push({
			campo: 'url',
			mensagem: 'Url é obrigatoria e tem que ser [http://] ou [https://]'
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

	if (respostaDeErro.detalhes.length > 0) return res.status(400).json(respostaDeErro)
	next()
}

const validarCamposPatch = (req, res, next) => {
	const { titulo, descricao, tags } = req.body
	const respostaDeErro = { erro: 'Dados invalidos', detalhes: [] }

	if (titulo !== undefined && (titulo.length < 5 || titulo.length > 200)) {
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

	if (respostaDeErro.detalhes.length > 0) return res.status(400).json(respostaDeErro)
	next()
}

module.exports = { validarCamposPost, validarCamposPatch }
