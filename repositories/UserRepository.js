const User = require('../models/User'); 

module.exports = class UserRepository {

    static async createUser(user){
        const newUser = await user.save();
        return newUser;
    }

    static async findUser(email){
        const user = await User.findOne({ email: email }).select("-password");
        return user;
    }

    static async findUserById(id){
        const user = await User.findById(id).select("-password");
        return user;
    }

    static async UpdateUser(){}

    static async DeleteUser(){}

}