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
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    }
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction
