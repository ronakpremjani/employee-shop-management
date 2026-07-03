const express = require('express');

const router = express.Router();

const {
    leaveRequest,
    getLeaveRequests,
    updateLeaveRequestStatus
} = require('../controllers/leaveController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, leaveRequest);
router.get('/', protect, adminOnly, getLeaveRequests);
router.put('/:id/status', protect, adminOnly, updateLeaveRequestStatus);    

module.exports = router;