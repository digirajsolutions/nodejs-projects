const express = require('express')
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller')
const User = require('../models/User.model')

const advancedResults = require('../middleware/advancedResults')
const { protect, authorizeRoles } = require('../middleware/auth')

const router = express.Router()

router.use(protect)
router.use(authorizeRoles('admin'))

router.route('/').get(advancedResults(User), getUsers).post(createUser)
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
