const mongoose = require('mongoose');
const User = require('./userModel');



async function registerUser(username, password) {
    try {
        const user = new User({ username, password });
        return result = await user.save();
    } catch (err) {
        return null;
    }
}


module.exports = {
    registerUser,

}