const express = require('express')
const cookieParser = require('cookie-parser');
const helmet = require('helmet')
const cors = require('cors')

const routes = require('./routes/index')


const { logger } = require('./middlewares/logger')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()


app.disable('etag')
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store')
	next()
})

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:3000', 'http://localhost:5500'],
  credentials: true
}))

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // parseia form data

app.use(cookieParser());
app.use(logger)

app.use('/api/v1', routes)

app.all('/*any', (req, res) => {
	res.status(404).json({
		erro: `Rota: ${req.method} ${req.path} não existe nessa API`
	})
})

app.use(errorHandler)

module.exports = app
