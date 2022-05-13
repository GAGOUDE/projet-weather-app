const mongoose = require('mongoose')

/* Schéma des users */
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
})

module.exports = mongoose.model('users', userSchema);