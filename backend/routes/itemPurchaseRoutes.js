const express = require('express');
const router = express.Router();

const {
    createItemPurchase,
    getAllItemPurchases,
    getMyItemPurchases
} = require('../controllers/itemPurchaseController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, createItemPurchase);
router.get('/', protect, adminOnly, getAllItemPurchases);
router.get('/my', protect, getMyItemPurchases);

module.exports = router;
