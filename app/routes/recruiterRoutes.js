const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route Protection: Recruiter or Admin Allowed
router.use(authMiddleware.isAuthenticated);
router.use(authMiddleware.authorizeRoles('recruiter', 'admin'));

// Question Bank Routes
router.post('/questions', recruiterController.createQuestion);
router.get('/questions', recruiterController.getQuestions);

// Assessment Builder Routes
router.post('/assessments', recruiterController.createAssessment);
router.get('/assessments', recruiterController.getAssessments);
router.put('/assessments/publish/:assessmentId', recruiterController.publishAssessment);
router.get('/assessments/:assessmentId/analytics', recruiterController.getAssessmentAnalytics);

module.exports = router;