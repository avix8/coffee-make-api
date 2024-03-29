const { Router } = require('express')
const {
    user,
    register,
    login,
    logout,
    refresh
} = require('../controllers/auth.js')
const { isAuth } = require('../middlewares/auth.js')

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/user', isAuth, user)
router.post('/logout', logout)

module.exports = router
