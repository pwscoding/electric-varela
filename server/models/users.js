const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    tokens: [{
        token: { type: String, required: true },
        last_login: { type: String }
    }]
});

// We are making our password hash
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
})

// We are generating the tokens
userSchema.methods.generateAuthToken = async function () {
    try {
        let payload = { _id: this._id }
        let unique32Char = process.env.SECRET_CHAR
        let token = jwt.sign(payload, unique32Char)
        let last_login = new Date()
        // add this token to database
        this.tokens = this.tokens.concat({ token: token, last_login })
        await this.save()
        return token;
    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model('Userschema', userSchema);

module.exports = User;
