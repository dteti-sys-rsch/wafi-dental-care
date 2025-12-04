const express = require('express')
const router = express.Router()
const branchController = require('../controllers/branch')

router.post('/', branchController.createBranch)
router.get('/', branchController.getAllBranches)
router.put('/:branchId', branchController.updateBranchById)
router.delete('/:branchId', branchController.deleteBranchById)

module.exports = router
