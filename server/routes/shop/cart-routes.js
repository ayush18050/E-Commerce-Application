const express = require('express');
const router = express.Router();
const { addToCart, fetchCartItems, updateCartItem, deleteCartItem } = require('../../controllers/shop/cart-controller');


router.get('/get/:userId', fetchCartItems);
router.post('/add', addToCart);
router.put('/update-cart', updateCartItem);
router.delete('/delete/:userId/:productId', deleteCartItem);

module.exports = router;