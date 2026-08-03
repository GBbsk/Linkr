class AppError extends Error {
    constructor(code, detalhes = null) {
        super(code)
        this.name = 'AppError'
        this.code = code
        this.detalhes = detalhes
    }
}

module.exports = {
    AppError
}