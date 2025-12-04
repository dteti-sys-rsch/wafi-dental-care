const User = require('../models/User')
const Transaction = require('../models/Transaction')
const Branch = require('../models/Branch')
const MedicalAssessment = require('../models/MedicalAssesement')
const Patient = require('../models/Patient')
const axios = require('axios')

/*
    Create a new transaction
*/
exports.createTransaction = async (req, res) => {
  try {
    const { date, amount, payment, patientId, doctorId, branchId } = req.body

    const doctor = await User.findById(doctorId)
    const patient = await Patient.findById(patientId)
    const branch = await Branch.findById(branchId)

    if (!doctor || !patient || !branch) {
      return res
        .status(400)
        .json({ message: 'Invalid doctor, patient, or branch ID' })
    }

    const transaction = new Transaction({
      transactionDate: date,
      transactionAmount: amount,
      paymentMethod: payment,
      patientId,
      assessmentBy: doctorId,
      branchId
    })

    await transaction.save()

    const lastAssessmentId = patient.patientMedicalAssessments.slice(-1)[0].toString()
    const suggestion = await MedicalAssessment.findOne({
      _id: lastAssessmentId,
      assessmentBy: doctorId
    })

    axios.post(process.env.WA_SERVICE_URL + '/send-message', {
      secret: process.env.WA_SECRET_KEY,
      number: patient.patientWAPhoneNumber,
      message: `Dear ${patient.patientFullName}, your transaction of amount Rp${amount} on ${date} at ${branch.branchName} ${branch.branchLocation} has been successfully recorded. Thank you for choosing our services! with suggestion ${suggestion.suggestion}`
    })

    res
      .status(201)
      .json({ message: 'Transaction created successfully', transaction })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
