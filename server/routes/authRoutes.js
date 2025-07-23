const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Apply rate limiting to auth routes
router.use(authController.authLimiter);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.protect, authController.getMe);
router.put('/me', authController.protect, authController.updateMe);

// Admin route example
router.get('/admin', authController.protect, authController.admin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

module.exports = router;