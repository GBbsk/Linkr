const request = require('supertest')
const app = require('../src/app')


const criarUsuarioEToknen = async (dados = {}) => {
    const sufixo = Math.floor(1000 + Math.random() * 9000)
  
    const defaults = {
        nome: `User_${sufixo}`,
        username: `u_${sufixo}`,
        email: `u_${sufixo}@email.com`,
        senha: 'SenhaValida123!'
    }

    const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ ...defaults, ...dados})

    if(res.status != 201){
        throw new Error(`Falha ao criar o usuario de teste: ${JSON.stringify(res.body)}`)
    }

    return {
        usuario: res.body.novoUsuario || res.body.usuario,
        accessToken: res.body.accessToken
    }
}

async function criarPost(accessToken, autor = 'Usuario Teste', dados = {}) {
  let postAutor = autor
  let extraDados = dados
  if (typeof autor === 'object' && autor !== null) {
    extraDados = autor
    postAutor = extraDados.autor || 'Usuario Teste'
  }

  const defaults = {
    titulo:    'Post de Teste com título longo o suficiente',
    url:       `https://exemplo.com/post-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    descricao: 'Descrição do post de teste',
    autor:     postAutor
  }

  const res = await request(app)
    .post('/api/v1/posts')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ ...defaults, ...extraDados })

  if (res.status !== 201) {
    throw new Error(`Falha ao criar post de teste: ${JSON.stringify(res.body)}`)
  }

  return res.body
}

module.exports = { criarUsuarioEToknen, criarPost }