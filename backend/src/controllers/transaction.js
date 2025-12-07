const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Branch = require("../models/Branch");
const MedicalAssessment = require("../models/MedicalAssesement");
const Patient = require("../models/Patient");
const axios = require("axios");

/*
  Get all transactions
*/
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("patientId", "patientFullName patientMedicalRecordNumber")
      .populate("assessmentBy", "username")
      .populate("branchId", "branchName branchLocation")
      .sort({ transactionDate: -1 }); // Most recent first

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
  Get transactions by branch ID
*/
exports.getTransactionsByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    const transactions = await Transaction.find({ branchId })
      .populate("patientId", "patientFullName patientMedicalRecordNumber")
      .populate("assessmentBy", "username")
      .populate("branchId", "branchName branchLocation")
      .sort({ transactionDate: -1 }); // Most recent first

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
    Create a new transaction
*/
exports.createTransaction = async (req, res) => {
  try {
    const { date, amount, payment, patientId, doctorId, branchId } = req.body;

    const doctor = await User.findById(doctorId);
    const patient = await Patient.findById(patientId);
    const branch = await Branch.findById(branchId);

    if (!doctor || !patient || !branch) {
      return res.status(400).json({ message: "Invalid doctor, patient, or branch ID" });
    }

    const transaction = new Transaction({
      transactionDate: date,
      transactionAmount: amount,
      paymentMethod: payment,
      patientId,
      assessmentBy: doctorId,
      branchId,
    });

    await transaction.save();

    if (!patient.patientMedicalAssessments || patient.patientMedicalAssessments.length === 0) {
      return res.status(400).json({
        message: "Patient has no medical assessments. Please create an assessment before recording a transaction.",
      });
    }

    const lastAssessmentId = patient.patientMedicalAssessments.slice(-1)[0].toString();
    const suggestion = await MedicalAssessment.findOne({
      _id: lastAssessmentId,
      assessmentBy: doctorId,
    });

    // Format the date nicely
    const formattedDate = new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    // Format the amount with thousand separators
    const formattedAmount = amount.toLocaleString("id-ID");

    // Create the message
    const message = `Hai ${patient.patientFullName},

Terima kasih telah menggunakan layanan kami!

================================
No. Transaksi : ${transaction._id.toString().substring(0, 10).toUpperCase()}
Tanggal : ${formattedDate}
Jumlah : Rp. ${formattedAmount},-
Metode Bayar : ${payment}
Status : Lunas
================================

Dokter : ${doctor.username}
Lokasi : ${branch.branchName}, ${branch.branchLocation}

SARAN MEDIS:
${suggestion ? suggestion.suggestion : "Tidak ada saran khusus"}

Semoga lekas sembuh! 
Jika ada keluhan, jangan ragu untuk menghubungi kami.`;

    axios.post(process.env.WA_SERVICE_URL + "/send-message", {
      secret: process.env.WA_SECRET_KEY,
      number: patient.patientWAPhoneNumber,
      message: message,
    });

    res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

