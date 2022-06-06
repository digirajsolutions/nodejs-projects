const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review.model')
const Bootcamp = require('../models/Bootcamp.model')

//get reviews
// GET /api/v1/reviews, GET /api/v1/bootcamps/:bootcampId/reviews
const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

//get single review
// GET /api/v1/reviews/:id
const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  if (!review) {
    return next(
      new ErrorResponse(`No review found with id ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, data: review })
})

//add new review
// POST /api/v1/bootcamps/:bootcampId/reviews
const addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with id ${req.params.bootcampId}`,
        404
      )
    )
  }

  const review = await Review.create(req.body)
  res.status(201).json({ success: true, data: review })
})

//update review
// PUT /api/v1/reviews/:id
const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`No review found with id ${req.params.id}`, 404)
    )
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to access this route`, 401))
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({ success: true, data: review })
})

//delete review
// PUT /api/v1/reviews/:id
const deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`No review found with id ${req.params.id}`, 404)
    )
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to access this route`, 401))
  }

  await review.remove()
  res
    .status(200)
    .json({ success: true, message: `Review deleted successfully` })
})

module.exports = {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
}
