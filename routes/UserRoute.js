const router = require('express').Router();

// Controllers 
const UserController = require('../controllers/UserController');

// Middlewares
const { checkToken } = require('../middlewares/VerifyToken');

// Post Routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Get Routes
router.get('/checkUser', UserController.checkUser);
router.get('/:id', UserController.getUserById);

// Patch Routes
router.patch('/edit/:id', checkToken, UserController.editUser);


module.exports = router;