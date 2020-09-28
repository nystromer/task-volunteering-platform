const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Task = require('./task')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        minlength: 2
    },
    lastName: {
        type: String,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        unique: true, // Creates index in database
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    createdTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    assignedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    completedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    pendingTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task' 
    }],
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }]
})

// statics keyword indicate model methods (e.g User.x) 
// I.e, like static methods in e.g Java
// called in routers -> /user/login
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


userSchema.methods.toJSON = function () {
    const user = this
    
    //toObject returns only the user data from this
    const userObject = user.toObject() 

    //hide sensitive/unecessary data
    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    //must use id.toString() since user.id return raw bytes
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// Hash the plain text password before saving/updating model
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        // 2nd param is "number of rounds" of hashing
        user.password = await bcrypt.hash(user.password, 8)
    }
    // must pass next, else server freeze here
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User