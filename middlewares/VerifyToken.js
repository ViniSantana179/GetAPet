const jwt = require('jsonwebtoken');
const {getToken, verifyToken} = require('../helpers/TokenHelper');


module.exports = {
    checkToken(req, res, next) {
        const token = getToken(req);
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }

        try {
            const verified = verifyToken(token);
            if(!verified) {
                return res.status(401).json({ message: "Invalid token" });
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: `Internal server error [token verification] - ${error}` });  
        }
    }
}
