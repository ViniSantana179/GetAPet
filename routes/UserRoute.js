const router = require('express').Router();

// Controllers
const UserController = require('../controllers/UserController');

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.get('/checkUser', UserController.checkUser);
router.get('/:id', UserController.getUserById);

module.exports = router;