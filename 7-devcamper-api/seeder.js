const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//loading env variables
dotenv.config({ path: './.env' })

//loading models
const Bootcamp = require('./models/Bootcamp.model')
const Course = require('./models/Course.model')
const User = require('./models/User.model')
const Review = require('./models/Review.model')

//connect to DB
mongoose.connect(process.env.MONGO_URI)

//read json files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
)

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
)

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
)

//export to DB
const exportData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await User.create(users)
    await Review.create(reviews)
    console.log(`Data exported...`.green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

//delete the data from DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log(`Data destroyed...`.red.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === '-e') {
  exportData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
