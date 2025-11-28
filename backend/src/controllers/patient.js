const Patient = require('../models/Patient')
const DiseaseHistory = require('../models/DiseaseHistory')
const MedicalAssessment = require('../models/MedicalAssesement')

/*
    Create a new patient
*/
exports.createPatient = async (req, res) => {
  try {
    const {
      medicalRecordNumber,
      fullname,
      DOB,
      birthPlace,
      gender,
      address,
      NIK,
      WAPhoneNumber,
      email
    } = req.body
    const patient = new Patient({
      patientMedicalRecordNumber: medicalRecordNumber,
      patientFullName: fullname,
      patientDOB: DOB,
      patientBirthPlace: birthPlace,
      patientGender: gender,
      patientAddress: address,
      patientNIK: NIK,
      patientWAPhoneNumber: WAPhoneNumber,
      patientEmail: email
    })
    await patient.save()
    res.status(201).json({ message: 'Patient created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
 Create disease history for a patient
*/
exports.addDiseaseHistory = async (req, res) => {
  try {
    const { patientId, diseaseName, diseaseDescription, diseaseDiagnosisDate } =
      req.body
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    const diseaseHistory = new DiseaseHistory({
      diseaseName,
      diseaseDescription,
      diseaseDiagnosisDate
    })
    await diseaseHistory.save()

    patient.patientDiseaseHistory.push(diseaseHistory._id)
    await patient.save()
    res.status(201).json({ message: 'Disease history added successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
    Get all patients
*/
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select(
      '-patientBirthPlace -patientGender -patientAddress -patientEmail -patientDiseaseHistory'
    )

    const formatted = patients.map((p) => ({
      ...p.toObject(),
      patientDOB: p.patientDOB.toISOString().split('T')[0]
    }))

    res.status(200).json({ patients: formatted })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
    View detailed patient info by ID
*/
exports.getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params
    const patient = await Patient.findById(patientId).populate(
      'patientDiseaseHistory'
    )

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    const formatted = patient.toObject()

    if (formatted.patientDOB) {
      formatted.patientDOB = formatted.patientDOB.toISOString().split('T')[0]
    }

    res.status(200).json({ patient: formatted })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
    Edit patient info by ID
*/
exports.editPatientById = async (req, res) => {
  try {
    const { patientId } = req.params

    const fieldMap = {
      medicalRecordNumber: 'patientMedicalRecordNumber',
      fullname: 'patientFullName',
      DOB: 'patientDOB',
      birthPlace: 'patientBirthPlace',
      gender: 'patientGender',
      address: 'patientAddress',
      NIK: 'patientNIK',
      WAPhoneNumber: 'patientWAPhoneNumber',
      email: 'patientEmail'
    }

    const bodyKeys = Object.keys(req.body)
    const invalidKeys = bodyKeys.filter((key) => !fieldMap[key])

    if (invalidKeys.length > 0) {
      return res.status(400).json({
        message: 'Invalid fields found in request body.',
        invalidFields: invalidKeys
      })
    }

    const updateData = {}
    bodyKeys.forEach((key) => {
      updateData[fieldMap[key]] = req.body[key]
    })

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: 'No valid fields provided to update.'
      })
    }

    const patient = await Patient.findByIdAndUpdate(patientId, updateData, {
      new: true
    })

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    return res.status(200).json({
      message: 'Patient updated successfully',
      patient
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
 Edit disease history for a patient
*/
exports.editDiseaseHistory = async (req, res) => {
  try {
    const {
      diseaseHistoryId,
      diseaseName,
      diseaseDescription,
      diseaseDiagnosisDate
    } = req.body
    const diseaseHistory = await DiseaseHistory.findById(diseaseHistoryId)
    if (!diseaseHistory) {
      return res.status(404).json({ message: 'Disease history not found' })
    }
    diseaseHistory.diseaseName = diseaseName || diseaseHistory.diseaseName
    diseaseHistory.diseaseDescription =
      diseaseDescription || diseaseHistory.diseaseDescription
    diseaseHistory.diseaseDiagnosisDate =
      diseaseDiagnosisDate || diseaseHistory.diseaseDiagnosisDate
    await diseaseHistory.save()
    res.status(200).json({ message: 'Disease history updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
    Delete disease history by ID
*/
exports.deleteDiseaseHistory = async (req, res) => {
  try {
    const { patientId, diseaseHistoryId } = req.params

    const patient = await Patient.findById(patientId)

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    if (patient.patientDiseaseHistory.includes(diseaseHistoryId)) {
      await Patient.updateOne(
        { _id: patientId },
        { $pull: { patientDiseaseHistory: diseaseHistoryId } }
      )
    }

    const diseaseHistory = await DiseaseHistory.findByIdAndDelete(
      diseaseHistoryId
    )

    if (!diseaseHistory) {
      return res.status(404).json({ message: 'Disease history not found' })
    }

    return res.status(200).json({
      message: 'Disease history deleted successfully'
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
    Delete patient by ID
*/
exports.deletePatientById = async (req, res) => {
  try {
    const { patientId } = req.params

    const patient = await Patient.findById(patientId)

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    if (
      Array.isArray(patient.patientDiseaseHistory) &&
      patient.patientDiseaseHistory.length > 0
    ) {
      return res.status(400).json({
        message: 'Cannot delete patient because disease history still exists!'
      })
    }

    await Patient.findByIdAndDelete(patientId)

    return res.status(200).json({
      message: 'Patient deleted successfully'
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
  Create medical assessment for a patient by a doctor
*/
exports.createMedicalAssessment = async (req, res) => {
  try {
    const { patientId, date, subjective, objective, diagnosisAndAction } =
      req.body
    const assessmentBy = req.userId

    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    const medicalAssessment = new MedicalAssessment({
      patientId,
      assessmentBy,
      assessmentDate: date,
      assesementSubjective: subjective,
      assesementObjective: objective,
      assesementDiagnosisAndAction: diagnosisAndAction
    })
    await medicalAssessment.save()

    patient.patientMedicalAssessments.push(medicalAssessment._id)
    await patient.save()
    res.status(201).json({
      message: 'Medical assessment created successfully'
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/*
  Get medical assessments for a patient
*/
exports.getMedicalAssessmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params
    const patient = await Patient.findById(patientId).populate({
      path: 'patientMedicalAssessments',
      populate: {
        path: 'assessmentBy',
        select: 'username'
      }
    })

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.status(200).json({
      medicalAssessments: patient.patientMedicalAssessments
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
