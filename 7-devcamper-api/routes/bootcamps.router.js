const express = require('express')
const {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  photoUpload,
} = require('../controllers/bootcamps.controller')

const Bootcamp = require('../models/Bootcamp.model')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorizeRoles } = require('../middleware/auth')

//include other resource routers
const courseRouter = require('./courses.router')
const reviewRouter = require('./reviews.router')

const router = express.Router()

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getAllBootcamps)
  .post(protect, authorizeRoles('publisher', 'admin'), createBootcamp)

router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(protect, authorizeRoles('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorizeRoles('publisher', 'admin'), deleteBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

//Rerouting into other resources routers
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router
  .route('/:id/photo')
  .put(protect, authorizeRoles('publisher', 'admin'), photoUpload)

module.exports = router
