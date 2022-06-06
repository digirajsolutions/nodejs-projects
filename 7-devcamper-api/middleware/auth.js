const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const errorResponse = require('../utils/errorResponse')
const User = require('../models/User.model')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
    // } else if (req.cookies.token) {
    //   token = req.cookies.token
  }

  //check whether token exists
  if (!token) {
    return next(new errorResponse('Not authorized to access this route', 401))
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
    req.user = await User.findById(decoded.id)
    next()
  } catch (err) {
    return next(new errorResponse('Not authorized to access this route', 401))
  }
})

//grant access to specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorResponse(
          `User role ${req.user.role} not authorized to access this route`,
          403
        )
      )
    }
    next()
  }
}

module.exports = { protect, authorizeRoles }
