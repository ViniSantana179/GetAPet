const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    async createUserToken(user, req ,res) {
        // Create token
        const token = jwt.sign({
            name: user.name,
            id: user._id,
        }, process.env.JWT_SECRET);

        // return token
        return res.json({ 
            message: "Voce esta autenticado",
            token: token,
            userId: user._id,
        });
    },
    getToken(req) {
        const token = req.headers.authorization;
        if (!token) {
            return null;
        }

        const tokenArray = token.split(' ');
        if (tokenArray.length !== 2) {
            return null;
        }

        return tokenArray[1];
    },
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            return null;
        }
    }
}