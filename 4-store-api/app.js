require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products.router')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h2>Store API</h2><a href="/api/v1/products">Products route</a>')
})

app.use('/api/v1/products', productsRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    //connectDB
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT, console.log(`Server aaikat aaahhheeeee...!!!`))
  } catch (error) {
    console.log(error)
  }
}

start()
