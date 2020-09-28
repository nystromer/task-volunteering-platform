const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    const task = new Task(req.body)
    //from auth
    const user = req.user
    try {
        await task.save()
        console.log("hejhej")
        console.log(user.createdTasks)
        user.createdTasks = user.createdTasks.concat(task)
        console.log("nää")
        console.log(user.createdTasks)
        await user.save() 
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(201).send(tasks)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = Task.findById({_id})
        if(!task) return res.status(404).send()
        res.status(201).send(task)
    } catch {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 
                            'description', 
                            'status', 
                            'assigned', 
                            'postalCode',
                            'volunteers']

    // Check if valid fields to update
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id})

        if (!task) {
            return res.status(404).send()
        }

        // Commence updates
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id})

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router