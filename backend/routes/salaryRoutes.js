const express = require('express');

const router = express.Router();

const {
    generateSalary,
    getAllSalaries,
    getMySalaries
} = require('../controllers/salaryController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/generate', protect, adminOnly, generateSalary);
router.get('/', protect, adminOnly, getAllSalaries);
router.get('/my', protect, getMySalaries);

module.exports = router;