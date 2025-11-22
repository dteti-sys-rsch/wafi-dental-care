const mongoose = require('mongoose')

const PatientSchema = new mongoose.Schema({
  patientMedicalRecordNumber: {
    type: String,
    required: true,
    unique: true
  },
  patientFullName: {
    type: String,
    required: true
  },
  patientDOB: {
    type: Date,
    required: true
  },
  patientBirthPlace: {
    type: String,
    required: true
  },
  patientGender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
    required: true
  },
  patientAddress: {
    type: String,
    required: true
  },
  patientNIK: {
    type: Number,
    required: true,
    unique: true
  },
  //   START WITH COUNTRY CODE, E.G., +62
  patientWAPhoneNumber: {
    type: Number,
    required: true
  },
  patientEmail: {
    type: String,
    default: ''
  },
  patientDiseaseHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiseaseHistory'
    }
  ]
})

const Patient = mongoose.model('Patient', PatientSchema)

module.exports = Patient
