const express = require('express')
const app = express()
const tasks = require('./routes/tasks.router')
const connectDB = require('./db/connect')
require('dotenv').config()

//middleware
app.use(express.static('./public'))
app.use(express.json())

//Routes
app.get('/hello', (req, res) => {
  res.send('Task manager app!')
})

app.use('/api/v1/tasks', tasks)

const PORT = 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT, console.log(`Listening on PORT ${PORT}...`))
  } catch (error) {
    console.log(error)
  }
}

start()

//app.get('/api/v1/tasks')        - get all the tasks
//app.post('/api/v1/tasks')       - create the task
//app.get('/api/v1/tasks/:id')    - get the single tasks
//app.patch('/api/v1/tasks/:id')  - update the task
//app.delete('/api/v1/tasks/:id') - delete the task
