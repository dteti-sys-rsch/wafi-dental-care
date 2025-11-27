const mongoose = require('mongoose')

const MedicalAssessmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    assessmentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assessmentDate: {
        type: Date,
        required: true
    },
    assesementSubjective: {
        type: String,
        required: true
    },
    assesementObjective: {
        type: String,
        required: true
    },
    assesementDiagnosisAndAction: {
        type: String,
        required: true
    },
})

const MedicalAssessment = mongoose.model(
  'MedicalAssessment',
  MedicalAssessmentSchema
)

module.exports = MedicalAssessment
