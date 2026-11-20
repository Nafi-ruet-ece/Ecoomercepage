const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Storefront UI route
router.get('/shop', productController.renderShopPage);

// REST API endpoint to retrieve all mock products
router.get('/api/products', productController.getProducts);

module.exports = router;

