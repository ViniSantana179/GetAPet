const User = require('../models/User');
const {encryptPassword, verifyPassword} = require('../helpers/PasswordHelper');
const {createUserToken, getToken, verifyToken} = require('../helpers/TokenHelper');
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
            const userExists = await User.findOne({ email: email });
            
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
            const user = await newUser.save();

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
            const user = await User.findOne({ email: email });
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

            currentUser = await User.findOne({ _id: decoded.id }).select('-password');
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
            const user = await User.findById(id).select('-password');
            if(!user) {
                return res.status(422).json({ message: `There is no user with this id. [${id}]` });
            }
            res.status(200).send(user); 
        } catch (error) {
            res.status(500).json({ message: `Internal server error [get user by id] - ${error}` });
        }


    }

}