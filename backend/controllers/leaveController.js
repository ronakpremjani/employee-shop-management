const Attendance = require('../models/Attendance');
const LeaveManagement = require('../models/LeaveManagement');

const leaveRequest = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        if (start < today) {
            return res.status(400).json({
                success: false,
                message: 'Leave cannot be applied for past dates.'
            });
        }

        if (!startDate || !endDate || !reason) {

            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });

        }

        const existingLeave = await LeaveManagement.findOne({
        user: req.user._id,
        status: { $in: ['Pending', 'Approved'] },

        $or: [
            {
                startDate: { $lte: end },
                endDate: { $gte: start }
            }
            ]
});

        if (existingLeave) {
            return res.status(409).json({
                success: false,
                message: 'You already have a leave request for these dates.'
            });
}

        const leave = await LeaveManagement.create({
            user: req.user._id,
            dateFrom: start,
            dateTo: end,
            reason,
            status: 'pending',
            approvedBy: null
        });

        return res.status(201).json({
            success: true,
            message: 'Leave request submitted successfully',
            data: leave
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveManagement.find({ user: req.user._id }).sort({ startDate: -1 });

        return res.status(200).json({
            success: true,
            data: leaveRequests
        });

    }   catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateLeaveRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Find leave request
        const leaveRequest = await LeaveManagement.findById(id);

        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        // Prevent approving/rejecting twice
        if (leaveRequest.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Leave request has already been processed'
            });
        }

        // Update leave
        leaveRequest.status = status;
        leaveRequest.approvedBy = req.user._id;

        await leaveRequest.save();

        return res.status(200).json({
            success: true,
            message: `Leave request ${status.toLowerCase()} successfully`,
            data: leaveRequest
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    leaveRequest,
    getLeaveRequests,
    updateLeaveRequestStatus
};

