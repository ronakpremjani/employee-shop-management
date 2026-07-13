const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    month: {
        type: Number,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    basicSalary: {
        type: Number,
        required: true
    },

    workingDays: {
        type: Number,
        required: true
    },

    presentDays: {
        type: Number,
        required: true
    },

    leaveDays: {
        type: Number,
        default: 0
    },

    absentDays: {
        type: Number,
        default: 0
    },

    attendanceDeduction: {
        type: Number,
        default: 0
    },

    advanceDeduction: {
        type: Number,
        default: 0
    },

    purchaseDeduction: {
        type: Number,
        default: 0
    },

    netSalary: {
        type: Number,
        required: true
    },

    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
   paidAmount: {
        type: Number,
        default: 0
    },

    carryForwardAmount: {
        type: Number,
        default: 0
    },

    paymentStatus: {
        type: String,
        enum: ['Pending', 'Partially Paid', 'Paid'],
        default: 'Pending'
    }

},
{
    timestamps: true
}
);

salarySchema.index(
    {
        user: 1,
        month: 1,
        year: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model('Salary', salarySchema);
