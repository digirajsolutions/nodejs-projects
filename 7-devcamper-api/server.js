const path = require('path')
const express = require('express')
require('dotenv').config()
require('colors')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

const connectDB = require('./config/database')
const errorHandler = require('./middleware/error')

//Routing files
const bootcampRoutes = require('./routes/bootcamps.router')
const courseRoutes = require('./routes/courses.router')
const authRoutes = require('./routes/auth.router')
const usersRoutes = require('./routes/users.router')
const reviewsRoutes = require('./routes/reviews.router')

const app = express()
app.use(express.json()) //body parser
app.use(cookieParser()) //cookie parsing
app.use(mongoSanitize()) //sanitizing database
app.use(helmet()) //security headers
app.use(xss()) //preventing xss attacks
app.use(hpp())
app.use(cors()) //Enable CORS

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10mins
  max: 100,
})
app.use(limiter)

//logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//file uploading
app.use(fileupload())

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.send('Helloo world! From express...')
})

//Routing
app.use('/api/v1/bootcamps', bootcampRoutes)
app.use('/api/v1/courses', courseRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/reviews', reviewsRoutes)
app.use(errorHandler)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB()
    app.listen(port, () => {
      console.log(
        `Server running on ${process.env.NODE_ENV} mode on port ${port}`.green
          .underline.bold
      )
    })
  } catch (error) {
    console.log(`Message: ${error.message}`.red.underline)
    process.exit(1)
  }
}

start()
