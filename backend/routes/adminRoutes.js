const express = require('express');

const router = express.Router();

const {
    createStaff,
    updateStaff,
    deactivateStaff ,
    getAllStaff
} = require('../controllers/adminController');

const { adminOnly } = require('../middleware/adminMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, createStaff);
router.put('/:id', protect, adminOnly, updateStaff);
router.put('/:id/status', protect, adminOnly, deactivateStaff);
router.get('/', protect, adminOnly, getAllStaff);

module.exports = router;

