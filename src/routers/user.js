const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(201).send(users)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        res.status(200).send({user : req.user, token: req.token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById({_id})
        if(!user) return res.status(404).send()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    console.log(user)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        console.log(token)
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
        //res.status(200).send(user)
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router