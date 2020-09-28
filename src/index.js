const express = require('express') 
const cors = require('cors');
require('./db/mongoose')

const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()

app.use(cors())
// Specify automatic parsing of json on requests
app.use(express.json())

// Add routers
app.use(userRouter)
app.use(taskRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Server is running on port ' + port)
})