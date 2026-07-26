const { Router } = require('express')
const postsRouter = require('./posts.routes')
const userRouter = require('./auth.routes')

const router = Router()

router.use('/posts', postsRouter)
router.use('/auth', userRouter)

router.get('/health', (req, res) => {
	res.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		uptime: process.uptime()
	})
})

module.exports = router
