const Attendance = require('../models/attendance');

// ----------------------------------
// Check In
// ----------------------------------

const checkIn = async (req, res) => {
    try {
        const userId = req.user_id;

        // Start of today (00:00:00)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in today
        const existingAttendance = await Attendance.findOne({
            user: userId,
            date: today
        });

        if (existingAttendance) {
            return res.status(409).json({
                success: false,
                message: 'You have already checked in today.'
            });
        }

        // Create attendance
        const attendance = await Attendance.create({
            user: userId,
            date: today,
            checkIn: new Date()
        });

        return res.status(201).json({
            success: true,
            message: 'Check-in successful',
            data: attendance
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ----------------------------------
// Check Out
// ----------------------------------

const checkOut = async (req, res) => {
    try {
        const userId = req.user_id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find today's attendance
        const attendance = await Attendance.findOne({
            user: userId,
            date: today
        });

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Please check in first.'
            });
        }

        // Already checked out?
        if (attendance.checkOut) {
            return res.status(409).json({
                success: false,
                message: 'You have already checked out today.'
            });
        }

        // Set checkout time
        attendance.checkOut = new Date();

        // Calculate total hours
        const milliseconds = attendance.checkOut - attendance.checkIn;
        const hours = milliseconds / (1000 * 60 * 60);

        attendance.totalHours = Number(hours.toFixed(2));

        await attendance.save();

        return res.status(200).json({
            success: true,
            message: 'Check-out successful',
            data: attendance
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ----------------------------------
// My Attendance
// ----------------------------------

const getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance
            .find({ user: req.user_id })
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            data: attendance
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ----------------------------------
// Admin - Get User Attendance
// ----------------------------------

const getAttendanceByUserId = async (req, res) => {
    try {
        const attendance = await Attendance
            .find({ user: req.params.userId })
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            data: attendance
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    checkIn,
    checkOut,
    getMyAttendance,
    getAttendanceByUserId
};