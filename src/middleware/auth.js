// Middleware is simply something that is called inbetween the request arrive and express doing something with it
// It is invoked by being passed as an argument to the endpoints/routers
// E.g router.get('/users/:id', <MIDDLEWARE>, async (req, res) => {
// This is good for when you want a common function to always run, such as authentication.
// next() has to be passed to give control back to express
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Authentication failed' })
    }
}

module.exports = auth