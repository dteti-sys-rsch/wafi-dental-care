const Branch = require('../models/Branch')

/*
  Create a new branch
*/
exports.createBranch = async (req, res) => {
  try {
    const { branchName, branchLocation } = req.body
    const branch = new Branch({
      branchName,
      branchLocation
    })
    await branch.save()
    res.status(201).json({ message: 'Branch created successfully', branch })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
  Get all branches
*/
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find()
    res.status(200).json({ branches })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
  Edit branch by ID
*/
exports.updateBranchById = async (req, res) => {
  try {
    const { branchId } = req.params
    const { name, location } = req.body
    const updateData = {}
    if (name) updateData.branchName = name
    if (location) updateData.branchLocation = location

    const branch = await Branch.findByIdAndUpdate(branchId, updateData, {
      new: true
    })
    res.status(200).json({ message: 'Branch updated successfully', branch })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
  Delete branch by ID
*/
exports.deleteBranchById = async (req, res) => {
  try {
    const { branchId } = req.params
    await Branch.findByIdAndDelete(branchId)
    res.status(200).json({ message: 'Branch deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
