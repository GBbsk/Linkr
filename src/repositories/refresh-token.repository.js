const { conectar, desconectar } = require('../databaseFunctions/connectionDB') 
const { hashSenha } = require('../utils/senha')
const { gerarTokenOpaco } = require('../utils/jwt')
const crypto = require('crypto')

const saveRefreshToken = async (usuario_id, token) => {
    try {
        const db = await conectar()
    
        const tokenHasheado = gerarTokenOpaco(token)
    
        const save = await db.run('INSERT INTO refresh_tokens (usuario_id, refreshToken, expira_em) VALUES (?, ?, ?)',
            [usuario_id, tokenHasheado, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()]
        )

        return save
    } catch (error) {
        console.error('[ERRO - saveRefreshToken]:', error.message)
        throw error
    }
};

const verifyRefreshToken = async (refreshToken) => {
    try {
        const db = await conectar()
    
        const tokenHasheado = gerarTokenOpaco(refreshToken)
    
        const verify = await db.get('SELECT * FROM refresh_tokens WHERE refreshToken = ? AND REVOGADO = 0',
            [tokenHasheado]
        );

        return verify
    } catch (error) {
        console.error('[ERRO - verifyRefreshToken]:', error.message)
        throw error
    }
};

const revokeRefreshToken = async (refreshToken) => {
    try {
        const db = await conectar()
        
        const tokenHasheado = gerarTokenOpaco(refreshToken)
        
        await db.run('UPDATE refresh_tokens SET revogado = ? WHERE refreshToken = ?',
            [1, tokenHasheado])      
            
        return true
    } catch (error) {
        console.error('[ERRO - revokeRefreshToken]:', error.message)
        throw error
    }
}

module.exports = {
    saveRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken
}