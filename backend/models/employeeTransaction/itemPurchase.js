const mongoose = require('mongoose');

const itemPurchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    productName: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    purchaseDate: {
        type: Date,
        default: Date.now
    },

    paymentMethod: {
        type: String,
        enum: ['Cash', 'Salary', 'Online'],
        required: true
    },

    status: {
        type: String,
        enum: ['Pending', 'Deducted', 'Cancelled'],
        default: 'Pending'
    },

    deductedMonth: {
        type: Number,
        default: null
    },

    deductedYear: {
        type: Number,
        default: null
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, 
{
    timestamps: true
});

module.exports = mongoose.model('ItemPurchase', itemPurchaseSchema);
