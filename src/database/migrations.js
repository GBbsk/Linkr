// Migrations: scripts que criam/modificam a estrutura do banco
// Em produção tem ferramentas de migrations (como Flyway ou db-migrate)

const { conectar } = require('./connectionDB')

const executarMigrations = async () => {
	const db = await conectar()

	await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS posts (
        id  TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        url TEXT NOT NULL,
        descricao TEXT NOT NULL,
        tags TEXT NOT NULL,
        votos INTEGER NOT NULL DEFAULT 0,
        autor TEXT NOT NULL,
        criadoEm TEXT NOT NULL,

        FOREIGN KEY (autor) REFERENCES usuarios(name) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS post_curtidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE (user_id, post_id),

        FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        refreshToken TEXT NOT NULL UNIQUE,
        usuario_id INTEGER NOT NULL,
        expira_em DATATIME NOT NULL,
        revogado BOOLEAN DEFAULT 0,

        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );

        -- indice nas tags acelera filtros por tags
        CREATE INDEX IF NOT EXISTS idx_posts_tags
            ON posts(tags);

        -- indice nos votos acelera a ordenacao
        CREATE INDEX IF NOT EXISTS idx_posts_votos
            ON posts(votos DESC);

        `)

	console.log('Migrations, executadas com sucesso')
}

module.exports = { executarMigrations }
