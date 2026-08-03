const request = require('supertest')
const app     = require('../src/app')
const { criarUsuarioEToknen, criarPost } = require('./helpers')

describe('GET /api/v1/posts', () => {
  it('retorna lista vazia quando não há posts', async () => {
    const res = await request(app).get('/api/v1/posts')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('retorna posts com limite correto', async () => {
    const { accessToken, usuario } = await criarUsuarioEToknen()
    const autor = usuario ? usuario.name : 'Usuario Teste'
    await criarPost(accessToken, autor)
    await criarPost(accessToken, autor)
    await criarPost(accessToken, autor)

    const res = await request(app).get('/api/v1/posts?limite=2')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})

describe('POST /api/v1/posts', () => {
  it('cria post quando autenticado', async () => {
    const { accessToken, usuario } = await criarUsuarioEToknen()
    const autor = usuario ? usuario.name : 'Ana Silva'

    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        titulo:    'Post válido com título suficientemente longo',
        url:       'https://exemplo.com/post-valido',
        descricao: 'Uma descrição qualquer',
        autor:     autor
      })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      titulo: 'Post válido com título suficientemente longo',
      url:    'https://exemplo.com/post-valido',
      autor:  autor
    })
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('criadoEm')
  })

  it('retorna 401 sem token', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .send({ titulo: 'Qualquer', url: 'https://exemplo.com', autor: 'Autor' })

    expect(res.status).toBe(401)
  })

  it('retorna 400 com URL inválida', async () => {
    const { accessToken, usuario } = await criarUsuarioEToknen()
    const autor = usuario ? usuario.name : 'Ana Silva'

    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        titulo: 'Título válido e longo o suficiente',
        url:    'nao-e-uma-url',
        autor:  autor
      })

    expect(res.status).toBe(400)
  })

  it('atualiza post com PATCH quando autenticado', async () => {
    const { accessToken, usuario } = await criarUsuarioEToknen()
    const autor = usuario ? usuario.name : 'Autor'
    const post = await criarPost(accessToken, autor)

    const res = await request(app)
      .patch(`/api/v1/posts/${post.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ titulo: 'Título Atualizado com Sucesso' })

    expect(res.status).toBe(200)
    expect(res.body.titulo).toBe('Título Atualizado com Sucesso')
  })
})

describe('POST /api/v1/posts/:id/votar', () => {
  it('incrementa votos e retorna o post atualizado', async () => {
    const { accessToken, usuario } = await criarUsuarioEToknen()
    const autor = usuario ? usuario.name : 'Autor'
    const post = await criarPost(accessToken, autor)

    const res = await request(app)
      .post(`/api/v1/posts/${post.id}/votar`)

    expect(res.status).toBe(200)
    expect(res.body.votos).toBe(1)
  })

  it('incrementa votos a cada chamada', async () => {
    const { accessToken, usuario } = await criarUsuarioEToknen()
    const autor = usuario ? usuario.name : 'Autor'
    const post = await criarPost(accessToken, autor)

    await request(app)
      .post(`/api/v1/posts/${post.id}/votar`)

    const res = await request(app)
      .post(`/api/v1/posts/${post.id}/votar`)

    expect(res.status).toBe(200)
    expect(res.body.votos).toBe(2)
  })
})