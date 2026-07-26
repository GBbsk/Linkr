const { TokenExpiredError } = require('jsonwebtoken');
const { conectar, desconectar } = require('../databaseFunctions/connectionDB')
const crypto = require('crypto')

const criarUsuario = async (id, nome, email, senhaHash) => {
    try {
        const db = await conectar()

        const dados = await db.get
        ('INSERT INTO usuarios (id, name, email, password) VALUES (?, ?, ?, ?) RETURNING *',
            [id, nome, email, senhaHash]
        );
        
        return {
            id: dados.id,
            name: dados.name,
            email: dados.email,
            data: dados.criadoEm
        }
        
    } catch (error) {
        if(error.code === 'SQLITE_CONSTRAINT' || (error.message.includes('UNIQUE constraint failed'))){

            if(error.message.includes('usuarios.name')){
                throw new Error('USERNAME_JA_EXISTE')
            }

            if(error.message.includes('usuarios.email')){
                throw new Error('EMAIL_JA_EXISTE')
            }
        }
        throw error
    }
}

const buscarEmail = async (email) => {
    const db = await conectar();
    const dados = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);

    return {
        id: dados.id,
        name: dados.name,
        email: dados.email
    }
}


const buscarPorId = async (id) => {
    const db = await conectar()

    const dados = await db.get('SELECT * FROM usuarios WHERE id = ?', [id])

     return {
        id: dados.id,
        name: dados.name,
        email: dados.email,
        criadoEm: dados.criadoEm
    }
}

module.exports = {
    criarUsuario,
    buscarEmail,
    buscarPorId
}