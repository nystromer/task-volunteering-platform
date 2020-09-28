const mongoose = require('mongoose')
const User = require('./task')

const taskSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        //required: true, use when auth is fixed
        ref: 'User'
    }, 
    title: {
        type: String,
        required: true,
        //maxlength: ?? TODO
        trim: true,
    },
    description: {
        type: String,
        required: true,
        //maxlength: ??, TODO
        trim: true
    },
    assigned: {
        type: Boolean,
        default: false
    },
    postalCode: {
        type: String,
        required: true,
        validate(value) {
            // TODO validate postal code
        }
    },
    volunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task