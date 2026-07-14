const express = require('express');

const router = express.Router();

const {
    generateSalary
} = require('../controllers/salaryController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/generate', protect, adminOnly, generateSalary);

module.exports = router;