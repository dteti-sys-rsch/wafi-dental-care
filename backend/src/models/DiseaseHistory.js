const mongoose = require('mongoose')

const DiseaseHistorySchema = new mongoose.Schema({
  diseaseName: {
    type: String,
    required: true
  },
  diseaseDescription: {
    type: String,
    default: ''
  },
  diseaseDiagnosisDate: {
    type: Date,
    required: true
  }
})

const DiseaseHistory = mongoose.model('DiseaseHistory', DiseaseHistorySchema)

module.exports = DiseaseHistory
