const mongoose = require('mongoose')

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI)
  console.log(
    `Connected to database: ${conn.connection.host}`.blue.underline.bold
  )
}

module.exports = connectDB
