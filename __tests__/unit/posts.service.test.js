const postsService = require('../../src/services/posts.service')
const postsRepo    = require('../../src/repositories/posts.repository')
const { AppError } = require('../../src/utils/appError')

// Substitui o repositório real por um mock
jest.mock('../../src/repositories/posts.repository', () => ({
    salvar: jest.fn(),
    checarUrlExiste: jest.fn(),
    buscarID: jest.fn(),
    atualizarPost: jest.fn(),
    deletarPost: jest.fn()
}))

describe('postsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    if (postsRepo.checarUrlExiste) {
      postsRepo.checarUrlExiste.mockResolvedValue(false)
    }
  })

  it('retorna erro de conflito quando URL já existe', async () => {
    postsRepo.checarUrlExiste.mockResolvedValue(true)

    const res = await postsService.criarPost({ titulo: 'Título Válido', url: 'https://exemplo.com', autor: 'Autor' })

    expect(res).toEqual({
      sucesso: false,
      erros: [
        {
          erro: 'Conflito',
          mensagem: 'Já existe um post cadastrado com esta URL.'
        }
      ]
    })
  })

  it('chama o repositório salvar com novo post quando válido', async () => {
    postsRepo.salvar.mockResolvedValue(true)

    const dados = {
      titulo:    'Título Válido do Post',
      url:       'https://exemplo.com/post',
      descricao: 'Descrição do post',
      autor:     'Ana Silva'
    }

    const res = await postsService.criarPost(dados)

    expect(res.sucesso).toBe(true)
    expect(postsRepo.salvar).toHaveBeenCalledWith(
      expect.objectContaining({
        titulo:    'Título Válido do Post',
        url:       'https://exemplo.com/post',
        autor:     'Ana Silva'
      })
    )
  })

  it('lança AppError 403 quando atualizarPost retorna falso', async () => {
    postsRepo.atualizarPost.mockResolvedValue(false)

    await expect(
      postsService.atualizarPost('post-id', { titulo: 'Novo título' })
    ).rejects.toThrow(AppError)
  })
})