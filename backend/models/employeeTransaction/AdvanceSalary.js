const mongoose = require('mongoose');

const AdvanceSalarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    requestedDate: {
      type: Date,
      default: Date.now,
    },

    approvedDate: {
      type: Date,
      default: null,
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    deductionStatus: {
      type: String,
      enum: ['Pending', 'Deducted'],
      default: 'Pending',
    },

    deductedMonth: {
      type: Number,
      default: null,
    },

    deductedYear: {
      type: Number,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'advance_salaries',
  }
);

module.exports = mongoose.model('AdvanceSalary', AdvanceSalarySchema);