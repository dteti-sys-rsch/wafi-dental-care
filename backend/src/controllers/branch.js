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
