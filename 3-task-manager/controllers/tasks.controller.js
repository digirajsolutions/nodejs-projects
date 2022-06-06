const { restart } = require('nodemon')
const Task = require('../models/Task')

const getAllTasks = async (req, res) => {
  // res.send('Get all tasks')
  try {
    const tasks = await Task.find({})
    res.status(200).json({ tasks })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const createTask = async (req, res) => {
  // res.send('create a task')
  try {
    const task = await Task.create(req.body)
    res.status(201).json({ task })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const getTask = async (req, res) => {
  // res.json({ id: req.params.id })
  try {
    const { id: taskID } = req.params //setting taskID as the alias of id
    const task = await Task.findOne({ _id: taskID })

    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskID}` })
    }

    res.status(200).json({ task })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const updateTask = async (req, res) => {
  // res.send('update a task')

  try {
    const { id: taskID } = req.params

    const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
      new: true,
      runValidators: true,
    })

    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskID}` })
    }

    res.status(200).json({ task })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const deleteTask = async (req, res) => {
  // res.send('delete a task')
  try {
    const { id: taskID } = req.params
    const task = await Task.findOneAndDelete({ _id: taskID })

    if (!task) {
      return res.status(404).json({ msg: `Task not found with id: ${taskID}` })
    }

    // res.status(200).json({ task })
    res.status(200).send('Task removed successfully.')
    // res.status(200).json({ task: null, status: 'success' })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

module.exports = { getAllTasks, createTask, getTask, updateTask, deleteTask }
