const { Router } = require( 'express')
const { hasRole } = require('../middlewares/auth')
const { create, getBySlug, getByCategory } = require('../controllers/product')

const router = Router()

router.post('/', async (req, res) => {
    // const user = await User.findOne({ _id: req.user._id })
    res.send({ somedata: 'lolar' })
})

router.post('/getBySlug', getBySlug)
router.post('/getByCategory', getByCategory)
router.post('/create', hasRole(['admin']), create)

module.exports = router
