const request = require('supertest')
const app     = require('../src/app')
const { criarUsuarioEToknen } = require('./helpers')

describe('POST /api/v1/auth/register', () => {
  it('cria usuário e retorna accessToken', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        nome:     'Ana Silva',
        username: 'anasilva',
        email:    'ana@email.com',
        senha:    'MinhaSenh4'
      })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body.novoUsuario).toMatchObject({
      name:  'Ana Silva',
      email: 'ana@email.com'
    })
    // senha_hash nunca deve aparecer na resposta
    expect(res.body.novoUsuario).not.toHaveProperty('senha_hash')
    expect(res.body.novoUsuario).not.toHaveProperty('password')
  })

  it('retorna 409 quando o email já existe', async () => {
        await criarUsuarioEToknen({ email: 'duplicado@email.com' })

        const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
            nome:  'Outro Usuário',
            email: 'duplicado@email.com',
            senha: 'OutraSenh4'
        })

        expect(res.status).toBe(409)
        expect(res.body).toHaveProperty('erro')
    })

    it('retorna 401 quando a senha é fraca', async () => {
        const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
            nome:  'Teste',
            email: 'fraco@email.com',
            senha: '123'     // fraca demais
        })

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('erro')
    })
})

describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await criarUsuarioEToknen({
      email: 'login@email.com',
      senha: 'LoginSenh4'
    })
  })

  it('retorna accessToken com credenciais válidas', async () => {
        const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@email.com', senha: 'LoginSenh4' })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('accessToken')
        // Cookie httpOnly deve estar presente na resposta
        expect(res.headers['set-cookie']).toBeDefined()
        expect(res.headers['set-cookie'].some(c => c.includes('refreshToken'))).toBe(true)
    })

    it('retorna 401 com senha errada — mesma mensagem que email inexistente', async () => {
        const resSenhaErrada = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@email.com', senha: 'SenhaErrada1' })

        const resEmailInexistente = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'naoexiste@email.com', senha: 'QualquerCoisa1' })

        // As duas respostas devem ter a mesma mensagem — timing attack prevention
        expect(resSenhaErrada.status).toBe(401)
        expect(resEmailInexistente.status).toBe(401)
        expect(resSenhaErrada.body.erro).toBe(resEmailInexistente.body.erro)
    })
})

describe('GET /api/v1/auth/refresh', () => {
    it('emite novo accessToken com refresh token válido no cookie', async () => {
        await criarUsuarioEToknen({
            email: 'refresh@email.com',
            senha: 'RefreshSenh4'
        })

        // 1. Faz login para obter o cookie com refresh token
        const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'refresh@email.com', senha: 'RefreshSenh4' })

        const cookies = loginRes.headers['set-cookie']

        // 2. Usa o cookie para obter um novo access token
        const refreshRes = await request(app)
        .get('/api/v1/auth/refresh')
        .set('Cookie', cookies)

        expect(refreshRes.status).toBe(200)
        expect(refreshRes.body).toHaveProperty('accessToken')
        // O novo accessToken deve ser diferente do anterior
        expect(refreshRes.body.accessToken).not.toBe(loginRes.body.accessToken)
    })

    it('retorna 401 sem cookie de refresh token', async () => {
        const res = await request(app).get('/api/v1/auth/refresh')
        expect(res.status).toBe(401)
    })
})