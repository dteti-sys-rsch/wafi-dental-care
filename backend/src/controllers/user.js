const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/*
  Create a new user with hashed password and assigned branch
*/
exports.createUser = async (req, res) => {
  try {
    const { username, password, branchId, role } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      username,
      password: hashedPassword,
      branch: branchId,
      role
    })
    await user.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
  Login user and verify password
*/
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username }).populate('branch')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const userData = user.toObject()
    delete userData.password
    delete userData._id
    delete userData.__v
    delete userData.branch.__v

    res.status(200).json({
      token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET),
      message: 'Login successful',
      user: userData
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
  Get all users with their associated branch details
*/
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v').populate({
      path: 'branch',
      select: '-_id -__v'
    })
    res.status(200).json({
      users,
      totalUsers: users.length,
      totalOwner: users.filter((user) => user.role === 'OWNER').length,
      totalManager: users.filter((user) => user.role === 'MANAGER').length,
      totalDoctor: users.filter((user) => user.role === 'DOCTOR').length,
      totalStaff: users.filter((user) => user.role === 'STAFF').length
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
  Update user details by ID
*/
exports.updateUserById = async (req, res) => {
  try {
    const { userId } = req.params
    const updateData = { ...req.body }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true
    }).select('-password -__v')
    res.status(200).json({ message: 'User updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
  Delete a user by ID
*/
exports.deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params
    await User.findByIdAndDelete(userId)
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
