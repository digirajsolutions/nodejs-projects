const User = require('../models/User.model')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  // res.send('Register user')
  const user = await User.create({ ...req.body })
  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}
const login = async (req, res) => {
  // res.send('Login user')
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password.')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  const correctPassword = await user.comparePassword(password)
  if (!correctPassword) {
    throw new UnauthenticatedError('Invalid Password')
  }

  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { register, login }
