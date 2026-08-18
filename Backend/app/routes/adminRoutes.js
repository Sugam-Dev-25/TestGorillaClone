const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route Protection: Admin Only
router.use(authMiddleware.isAuthenticated);
router.use(authMiddleware.authorizeRoles('admin'));

// Category Endpoints
router.post('/categories', adminController.createCategory);
router.get('/categories', adminController.getCategories);

// Recruiter Approval Endpoints
router.get('/recruiters/pending', adminController.getPendingRecruiters);
router.put('/recruiters/approve/:recruiterId', adminController.approveRecruiter);

module.exports = router;