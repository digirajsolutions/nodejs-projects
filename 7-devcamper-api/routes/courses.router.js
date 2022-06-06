const express = require('express')
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses.controller')

const Course = require('../models/Course.model')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorizeRoles } = require('../middleware/auth')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authorizeRoles('publisher', 'admin'), addCourse)
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorizeRoles('publisher', 'admin'), updateCourse)
  .delete(protect, authorizeRoles('publisher', 'admin'), deleteCourse)

module.exports = router
