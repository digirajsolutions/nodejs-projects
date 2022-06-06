const User = require('../models/User.model')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

//Register the user -> POST /api/v1/auth/register
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  //Creating user
  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  sendTokenResponse(user, 200, res)
})

//Login the user -> POST /api/v1/auth/login
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  //validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email or password', 400))
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(new ErrorResponse('User not found', 401))
  }

  const correctMatch = await user.matchPassword(password)
  if (!correctMatch) {
    return next(new ErrorResponse('Incorrect Password', 401))
  }

  sendTokenResponse(user, 200, res)
})

//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedToken()
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token })
}

//Get current logged in user - POST /api/v1/auth/me
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  // if (!user) {
  //   return next(new ErrorResponse(`No logged in user found`, 404))
  // }

  res.status(200).json({
    success: true,
    data: user,
  })
})

//Logout user, clear cookie - GET /api/v1/auth/logout
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: `User logged out`,
  })
})

//Forgot password - POST /api/v1/auth/forgotpassword
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorResponse(`No user found with this email`, 404))
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  //create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `This is a reset password email. Please make a put request to: \n\n ${resetUrl}`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    })

    res.status(200).json({ success: true, data: 'Email sent' })
  } catch (error) {
    console.log(error)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })
    return next(new ErrorResponse(`Email could not be sent`, 500))
  }

  // res.status(200).json({
  //   success: true,
  //   data: user,
  // })
})

//Reset password - PUT /api/v1/auth/resetpassword/:resettoken
const resetPassword = asyncHandler(async (req, res, next) => {
  //getting hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  })

  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 400))
  }

  //setting new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  sendTokenResponse(user, 200, res)
})

//Update user details - PUT /api/v1/auth/updatedetails
const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

//Update password - PUT /api/v1/auth/updatepassword
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401))
  }

  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logoutUser,
}
