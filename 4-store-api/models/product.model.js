const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Productch naav de reee'] },
  price: { type: Number, required: [true, 'Kitila denar ooo he'] },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now() },
  company: {
    type: String,
    enum: {
      values: [
        'Mahalaxmi Furniture',
        'Kumthekar Furniture',
        'Jyotirling Furniture',
        'Reliance Furniture',
      ],
      message: '{VALUE} support karat nahi',
    },
  },
})

module.exports = mongoose.model('Product', productSchema)
