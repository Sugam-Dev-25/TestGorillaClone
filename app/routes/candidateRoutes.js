const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protection: Candidate Only
router.use(authMiddleware.isAuthenticated);
router.use(authMiddleware.authorizeRoles('candidate'));

// Candidate Assessment Routes
router.get('/assessments', candidateController.getAvailableAssessments);
router.get('/assessments/start/:assessmentId', candidateController.startAssessment);
router.post('/assessments/submit/:assessmentId', candidateController.submitAssessment);
router.get('/results', candidateController.getMyResults);

module.exports = router;