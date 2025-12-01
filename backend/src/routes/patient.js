const express = require('express')
const router = express.Router()
const patientController = require('../controllers/patient')
const authMiddleware = require('../middlewares/auth')

// Patients
router.post('/register', authMiddleware.ensureAuthenticated, patientController.createPatient)
router.get('/', authMiddleware.ensureAuthenticated, patientController.getAllPatients)
router.get('/:patientId', authMiddleware.ensureAuthenticated, patientController.getPatientById)
router.put('/edit/:patientId', authMiddleware.ensureAuthenticated, patientController.editPatientById)
router.delete('/delete/:patientId', authMiddleware.ensureAuthenticated, patientController.deletePatientById)

// Disease History
router.post('/diseasehistory/add', authMiddleware.ensureAuthenticated, patientController.addDiseaseHistory)
router.put('/diseasehistory/edit', authMiddleware.ensureAuthenticated, patientController.editDiseaseHistory)
router.delete('/diseasehistory/delete/:patientId/:diseaseHistoryId', authMiddleware.ensureAuthenticated, patientController.deleteDiseaseHistory)

// Medical Assessment
router.post('/medicalassessment/add', authMiddleware.ensureAuthenticated, authMiddleware.ensureDoctor, patientController.createMedicalAssessment)
router.get('/medicalassessment/:patientId', authMiddleware.ensureAuthenticated, patientController.getMedicalAssessmentsByPatient)
router.put('/medicalassessment/edit/:assessmentId', authMiddleware.ensureAuthenticated, authMiddleware.ensureDoctor, patientController.editMedicalAssessment)
router.delete('/medicalassessment/delete/:assessmentId', authMiddleware.ensureAuthenticated, authMiddleware.ensureDoctor, patientController.deleteMedicalAssessment)

module.exports = router
