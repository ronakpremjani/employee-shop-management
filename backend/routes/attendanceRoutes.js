const express = require('express');

const router = express.Router();

const {
    checkIn,
    checkOut,
    getMyAttendance,
    getAttendanceByUserId
} = require('../controllers/attendanceController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/check-in', protect, checkIn);
router.put('/check-out', protect, checkOut);
router.get('/my-attendance', protect, getMyAttendance);
router.get('/user/:userId', protect, adminOnly, getAttendanceByUserId);

module.exports = router;