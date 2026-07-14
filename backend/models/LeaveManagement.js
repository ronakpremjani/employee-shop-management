const mongoose = require('mongoose');

const LeaveManagementSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        reason: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },

        dateFrom: {
            type: Date,
            required: true
        },      

        dateTo: {
            type: Date,
            required: true
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('LeaveManagement', LeaveManagementSchema);