const User = require('../models/User');
const {encryptPassword, verifyPassword} = require('../helpers/PasswordHelper');
const {createUserToken, getToken, verifyToken} = require('../helpers/TokenHelper');
const {createUser, findUser, findUserById} = require('../repositories/UserRepository');

require('dotenv').config();

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmPassword} = req.body;

        // validations
        if (!name || !email || !phone || !password || !confirmPassword) {   
            return res.status(422).json({ message: `Required fields are missing [name: ${name}] - [email: ${email}] - [phone: ${phone}] - [password:${password}] - [confirPassword:${confirmPassword}]` });
        }

        if (password !== confirmPassword) {
            return res.status(422).json({ message: 'Passwords not match' });
        }


        // Check if user already exists
        try {
            const userExists = await findUser(email);
            
            if(userExists) {
                return res.status(422).json({ message: 'User already exists' });
            }

            // encrypt password
            const passwordHash = encryptPassword(password);

            // Create new user
            const newUser = new User({
                name,
                email,
                phone,
                password: passwordHash
            });

            // Save user
            const user = await createUser(newUser);

            // Create token
            await createUserToken(user, req, res);
        } catch (error) {
            res.status(500).json({ message: `Internal server error [user register] - ${error}` });
        }
    }

    static async login(req, res) {
        const {email, password} = req.body;

        // Validations
        if (!email || !password) {
            return res.status(422).json({ message: `Required fields are missing [email: ${email}] - [password: ${password}]` });
        }

       try {
             // Check if user exists
            const user = await findUser(email);
            if(!user) {
                return res.status(422).json({ message: `There is no user with this email. [${email}]` });
            }

            // Veryfy password
            const checkPassword = verifyPassword(password, user.password);
            if(!checkPassword) {
                return res.status(422).json({ message: 'Invalid password' });
            }

        // Create token
        await createUserToken(user, req, res);
       } catch (error) {
        res.status(500).json({ message: `Internal server error [user login] - ${error}` });
       }
    }

    static async checkUser(req, res) {
        let currentUser ;
        
        console.log(req.headers.authorization);

        if(req.headers.authorization) {
            const token = getToken(req);
            const decoded = verifyToken(token);

            currentUser = await findUserById(decoded.id);
        }
        else {
            currentUser = null;
        }

        res.status(200).send(currentUser);
    }

    static async getUserById(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(422).json({ message: `Required fields are missing [id: ${id}]` });
        }
    
        try {
            const user = await findUserById(id);
            if(!user) {
                return res.status(422).json({ message: `There is no user with this id. [${id}]` });
            }
            res.status(200).send(user); 
        } catch (error) {
            res.status(500).json({ message: `Internal server error [get user by id] - ${error}` });
        }


    }

    static async editUser(req, res) {
        const  { id } = req.params;

        if (!id) {
            return res.status(422).json({ message: `Required fields are missing [id: ${id}]` });
        }

        try {
            const user = await findUserById(id);
            if(!user) {
                return res.status(422).json({ message: `There is no user with this id. [${id}]` });
            }

        } catch (error) {
            res.status(500).json({ message: `Internal server error [edit user] - ${error}` });
        }

        res.status(200).send({ message: `Edit user with id: ${id}` });
    }
}