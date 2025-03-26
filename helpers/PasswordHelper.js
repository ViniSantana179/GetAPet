const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
    encryptPassword(password) {
        const salt = bcrypt.genSaltSync(12);
        const encryptPassord = bcrypt.hashSync(password, salt);
        return encryptPassord;
    },
    verifyPassword(password, userPassword) {
        return bcrypt.compareSync(password, userPassword);
    }
}