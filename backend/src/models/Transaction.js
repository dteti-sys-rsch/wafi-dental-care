const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    transactionDate: {
        type: Date,
        required: true
    },
    transactionAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['CASH', 'CARD', 'QRIS'],
        required: true
    },
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
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    }
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction
