const { conectar, desconectar } = require('../database/connectionDB')
const { executarMigrations } = require('../database/migrations')
const { hashSenha } = require('./senha')
const { registrarUsuario } = require('../services/auth.service');

const usuariosIniciais = [
    {
        id: 'user-1',
        name: 'anasilva',
        email: 'ana@email.com',
        password: 'Senha1234'
    },
    {
        id: 'user-2',
        name: 'carlos_dev',
        email: 'carlos@email.com',
        password: 'Senha1234'
    },
    {
        id: 'user-3',
        name: 'mari_souza',
        email: 'mari@email.com',
        password: 'Senha1234'
    },
    {
        id: 'user-4',
        name: 'lucas_ops',
        email: 'lucas@email.com',
        password: 'Senha1234'
    },
    {
        id: 'user-5',
        name: 'fernanda_dados',
        email: 'fernanda@email.com',
        password: 'Senha1234'
    },
    {
        id: 'user-6',
        name: 'roberto_arch',
        email: 'roberto@email.com',
        password: 'Senha1234'
    },
    {
        id: 'user-7',
        name: 'assistente',
        email: 'assistente@email.com',
        password: 'Senha1234'
    },
    {
        id: 'user-8',
        name: 'bot',
        email: 'bot@email.com',
        password: 'Senha1234'
    }
];

const postsIniciais = [
    {
        id: '7f09312b-cb1d-45db-990a-995db0160a0b',
        titulo: 'Node.js Best Practices',
        url: 'https://github.com/goldbergyoni/nodebestpractices',
        descricao: 'Mais de 80 boas práticas para Node.js organizadas por categoria.',
        tags: ['nodejs', 'backend', 'boas-praticas'],
        votos: 47,
        autor: 'anasilva',
        criadoEm: '2024-01-10T00:00:00.000Z'
    },
    {
        id: 'e49db524-1fbc-4999-923f-bdff261904a6',
        titulo: 'Guia Definitivo de TypeScript',
        url: 'https://www.typescriptlang.org/docs/',
        descricao: 'Aprenda do zero ao avançado como tipar suas aplicações e evitar bugs em produção.',
        tags: ['typescript', 'javascript', 'frontend'],
        votos: 32,
        autor: 'carlos_dev',
        criadoEm: '2024-01-15T00:00:00.000Z'
    },
    {
        id: '42159670-3482-4df3-a170-07bfdb0be542',
        titulo: 'Entendendo a Context API do React',
        url: 'https://react.dev/reference/react/createContext',
        descricao: 'Como gerenciar estado global na sua aplicação React sem precisar de Redux.',
        tags: ['react', 'frontend', 'javascript'],
        votos: 21,
        autor: 'mari_souza',
        criadoEm: '2024-02-01T00:00:00.000Z'
    },
    {
        id: 'dbf7c462-ffb7-4a00-ab39-e935ea394d07',
        titulo: 'Docker para Desenvolvedores',
        url: 'https://docs.docker.com/get-started/',
        descricao: 'Crie ambientes de desenvolvimento idênticos ao de produção usando containers.',
        tags: ['docker', 'devops', 'infra'],
        votos: 55,
        autor: 'lucas_ops',
        criadoEm: '2024-02-12T00:00:00.000Z'
    },
    {
        id: 'c1f71df8-2b81-4235-93df-8dfba8eef8cf',
        titulo: 'SQL vs NoSQL: Qual escolher?',
        url: 'https://www.mongodb.com/nosql-explained',
        descricao: 'Um comparativo detalhado entre bancos relacionais e não-relacionais para seu projeto.',
        tags: ['database', 'sql', 'nosql'],
        votos: 19,
        autor: 'fernanda_dados',
        criadoEm: '2024-02-28T00:00:00.000Z'
    },
    {
        id: '902d847c-74bf-42f1-acfc-817bf57fc680',
        titulo: 'Dominando Express.js do Jeito Certo',
        url: 'https://expressjs.com/',
        descricao: 'Como estruturar rotas, middlewares e tratamento de erros escaláveis no Express.',
        tags: ['nodejs', 'express', 'backend'],
        votos: 38,
        autor: 'anasilva',
        criadoEm: '2024-03-05T00:00:00.000Z'
    },
    {
        id: '50c60907-73d2-43bb-81ef-c70e28f0ee00',
        titulo: 'Introdução ao Clean Architecture',
        url: 'https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html',
        descricao: 'Como desacoplar sua lógica de negócios de frameworks e ferramentas externas.',
        tags: ['arquitetura', 'clean-code', 'boas-praticas'],
        votos: 64,
        autor: 'roberto_arch',
        criadoEm: '2024-03-10T00:00:00.000Z'
    },
    {
        id: '893b8e4e-09f1-4db5-b827-89775073be74',
        titulo: 'CSS Grid e Flexbox: O Combo Perfeito',
        url: 'https://css-tricks.com/',
        descricao: 'Aprenda quando usar cada um e crie layouts responsivos complexos com facilidade.',
        tags: ['css', 'frontend', 'design'],
        votos: 14,
        autor: 'mari_souza',
        criadoEm: '2024-03-14T00:00:00.000Z'
    },
    {
        id: '8c5dce4e-a4ad-47e5-80b9-7b1b97eba01c',
        titulo: 'Aprenda cURL na Prática',
        url: 'https://curl.se/docs/',
        descricao: 'Guia definitivo de como fazer requisições HTTP pelo terminal com cURL.',
        tags: ['backend', 'ferramentas'],
        autor: 'assistente',
        votos: 0,
        criadoEm: '2026-07-03T23:44:27.139Z'
    },
    {
        id: '5a586a76-6449-4cbb-aca8-2b5baf00a3ea',
        titulo: 'Post de Teste PATCH',
        url: 'https://example.com/patch',
        descricao: 'desc',
        tags: ['teste'],
        autor: 'bot',
        votos: 0,
        criadoEm: '2026-07-04T00:39:08.979Z'
    },
    {
        id: 'a7789dee-cef9-4e46-8152-14534fe5ad98',
        titulo: 'Post de Teste 2',
        url: 'https://example.com/5199',
        descricao: 'desc',
        tags: ['teste'],
        autor: 'bot',
        votos: 0,
        criadoEm: '2026-07-04T00:40:20.197Z'
    }
];

async function seed() {
    await executarMigrations()
    const db = await conectar()

    try {
        const isReset = process.argv.includes('--reset')

        if (isReset) {
            console.log("Modo reset ativado, apagando o banco...")
            await db.run('DELETE FROM refresh_tokens')
            await db.run('DELETE FROM posts')
            await db.run('DELETE FROM usuarios')
            return 'O Banco foi limpo!'
        }

        const { total } = await db.get('SELECT COUNT(*) AS total FROM posts')

        if (total > 0) {
            console.log(`⚠️  Banco já tem ${total} posts. Seed ignorado.`)
            console.log('   Use npm run seed:reset para resetar.')
            return
        }

        console.log('Semeando o banco...')

        // 1. Inserir usuários
        for (const user of usuariosIniciais) {
			const usuario = {nome: user.name, email: user.email, senha: user.password}
            await registrarUsuario(usuario)
        }
        console.log(`✅ ${usuariosIniciais.length} usuários inseridos!`)

        // 2. Inserir posts
        const stmt = await db.prepare(
            `INSERT INTO posts (id, titulo, url, descricao, tags, votos, autor, criadoEm)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )

        for (const post of postsIniciais) {
            await stmt.run([
                post.id,
                post.titulo,
                post.url,
                post.descricao,
                JSON.stringify(post.tags),
                post.votos,
                post.autor,
                post.criadoEm
            ])
        }

        await stmt.finalize()
        console.log(`✅ ${postsIniciais.length} posts inseridos com sucesso no SQLite.`)

    } finally {
        // Garante que o banco SEMPRE fecha, mesmo que ocorra um erro acima
        await desconectar()
    }
}

seed().catch((err) => {
    console.error('Erro no seed:', err)
    process.exit(1)
})