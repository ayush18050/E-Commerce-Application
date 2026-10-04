const express = require('express');
const router = express.Router();
const { registerUser, loginUser,logoutUser, authMiddleware } = require('../../controllers/auth/auth-controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-auth', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'User is authenticated',
        user: req.user
    });
});


module.exports = router;