const User = require('../models/User.model')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const advancedResults = require('../middleware/advancedResults')

//Get all the users -> GET /api/v1/auth/users
const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

//Get single user -> GET /api/v1/auth/users/:id
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  res.status(200).json({
    success: true,
    data: user,
  })
})

//create single user -> POST /api/v1/auth/users
const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)

  res.status(201).json({
    success: true,
    data: user,
  })
})

//update the user -> PUT /api/v1/auth/users/:id
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

//delete the user -> DELETE /api/v1/auth/users/:id
const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    message: 'User Deleted',
  })
})

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser }