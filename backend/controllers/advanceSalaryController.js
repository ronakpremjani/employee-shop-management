const AdvanceSalary = require('../models/employeeTransaction/AdvanceSalary');

const requestAdvanceSalary = async (req, res) => {
    try {
        const { amount, reason } = req.body;

        if (!amount || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Amount and reason are required'
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than zero'
            });
        }

        const advance = await AdvanceSalary.create({
            user: req.user_id,
            amount: Number(amount),
            reason,
            createdBy: req.user_id
        });

        return res.status(201).json({
            success: true,
            message: 'Advance salary request submitted successfully',
            data: advance
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllAdvanceSalaryRequests = async (req, res) => {
    try {
        const advances = await AdvanceSalary.find()
            .populate('user', 'name email phone role')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: advances
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyAdvanceSalaryRequests = async (req, res) => {
    try {
        const advances = await AdvanceSalary.find({ user: req.user_id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: advances
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const approveAdvanceSalaryRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const advance = await AdvanceSalary.findById(id);

        if (!advance) {
            return res.status(404).json({
                success: false,
                message: 'Advance salary request not found'
            });
        }

        if (advance.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Advance salary request has already been processed'
            });
        }

        advance.status = 'Approved';
        advance.approvedBy = req.user_id;
        advance.approvedDate = new Date();
        await advance.save();

        const populatedAdvance = await AdvanceSalary.findById(id).populate('user', 'name email phone role');

        return res.status(200).json({
            success: true,
            message: 'Advance salary request approved successfully',
            data: populatedAdvance
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const rejectAdvanceSalaryRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const advance = await AdvanceSalary.findById(id);

        if (!advance) {
            return res.status(404).json({
                success: false,
                message: 'Advance salary request not found'
            });
        }

        if (advance.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Advance salary request has already been processed'
            });
        }

        advance.status = 'Rejected';
        advance.approvedBy = req.user_id;
        advance.approvedDate = new Date();
        await advance.save();

        const populatedAdvance = await AdvanceSalary.findById(id).populate('user', 'name email phone role');

        return res.status(200).json({
            success: true,
            message: 'Advance salary request rejected successfully',
            data: populatedAdvance
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    requestAdvanceSalary,
    getAllAdvanceSalaryRequests,
    getMyAdvanceSalaryRequests,
    approveAdvanceSalaryRequest,
    rejectAdvanceSalaryRequest
};
