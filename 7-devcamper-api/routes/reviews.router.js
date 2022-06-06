const express = require('express')
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews.controller')
const Review = require('../models/Review.model')

const router = express.Router({ mergeParams: true })

const advancedResults = require('../middleware/advancedResults')
const { protect, authorizeRoles } = require('../middleware/auth')

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorizeRoles('user', 'admin'), addReview)

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorizeRoles('user', 'admin'), updateReview)
  .delete(protect, authorizeRoles('user', 'admin'), deleteReview)

module.exports = router
