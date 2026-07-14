const ItemPurchase = require('../models/employeeTransaction/ItemPurchase');

const createItemPurchase = async (req, res) => {
    try {
        const { itemName, amount, paymentMethod } = req.body;

        if (!itemName || !amount || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Item name, amount, and payment method are required'
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than zero'
            });
        }

        if (!['Salary', 'Cash'].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Payment method must be Salary or Cash'
            });
        }

        const purchase = await ItemPurchase.create({
            user: req.user_id,
            itemName,
            amount: Number(amount),
            paymentMethod,
            status: 'Pending'
        });

        return res.status(201).json({
            success: true,
            message: 'Purchase logged successfully',
            data: purchase
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllItemPurchases = async (req, res) => {
    try {
        const purchases = await ItemPurchase.find()
            .populate('user', 'name email phone role')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: purchases
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyItemPurchases = async (req, res) => {
    try {
        const purchases = await ItemPurchase.find({ user: req.user_id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: purchases
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createItemPurchase,
    getAllItemPurchases,
    getMyItemPurchases
};
