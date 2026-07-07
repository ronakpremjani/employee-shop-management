const mongoose = require('mongoose');

const bonusSchema = new mongoose.Schema(
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

    grantedDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'AddedToSalary'],
      default: 'Pending',
    },

    addedInMonth: {
      type: Number,
      default: null,
    },

    addedInYear: {
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
    }
  },
  {
    timestamps: true,
    collection: 'bonuses',
  }
);

module.exports = mongoose.model('Bonus', bonusSchema);