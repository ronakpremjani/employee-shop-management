const express = require('express');
const router = express.Router();

const {
    requestAdvanceSalary,
    getAllAdvanceSalaryRequests,
    getMyAdvanceSalaryRequests,
    approveAdvanceSalaryRequest,
    rejectAdvanceSalaryRequest
} = require('../controllers/AdvanceSalaryController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, requestAdvanceSalary);
router.get('/', protect, adminOnly, getAllAdvanceSalaryRequests);
router.get('/my', protect, getMyAdvanceSalaryRequests);
router.put('/:id/approve', protect, adminOnly, approveAdvanceSalaryRequest);
router.put('/:id/reject', protect, adminOnly, rejectAdvanceSalaryRequest);

module.exports = router;
