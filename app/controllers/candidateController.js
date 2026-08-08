const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const TestAttempt = require('../models/TestAttempt');

class CandidateController {
    constructor() {
        this.getAvailableAssessments = this.getAvailableAssessments.bind(this);
        this.startAssessment = this.startAssessment.bind(this);
        this.submitAssessment = this.submitAssessment.bind(this);
        this.getMyResults = this.getMyResults.bind(this);
    }

    // 1. Get All Published & Public Assessments
    async getAvailableAssessments(req, res) {
        try {
            const assessments = await Assessment.find({ status: 'published', isPublic: true })
                .select('-questions')
                .populate('categoryIds', 'name type');

            return res.status(200).json({
                success: true,
                count: assessments.length,
                data: assessments
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 2. Start Assessment (Fetch Questions WITHOUT Correct Answers)
    async startAssessment(req, res) {
        try {
            const { assessmentId } = req.params;

            const assessment = await Assessment.findOne({ _id: assessmentId, status: 'published' })
                .populate({
                    path: 'questions',
                    select: '-correctAnswer -explanation' // Hide answer & explanation from candidate
                });

            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    message: 'Assessment not found or not available!'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Assessment loaded. Good luck!',
                data: {
                    assessmentId: assessment._id,
                    title: assessment.title,
                    durationMinutes: assessment.durationMinutes,
                    totalMarks: assessment.totalMarks,
                    questions: assessment.questions
                }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // 3. Submit Assessment & Auto-Evaluate Results
    async submitAssessment(req, res) {
        try {
            const { assessmentId } = req.params;
            const { userAnswers } = req.body; // Array of { questionId, selectedAnswer }

            const assessment = await Assessment.findById(assessmentId).populate('questions');
            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    message: 'Assessment not found!'
                });
            }

            let totalScore = 0;
            const evaluatedAnswers = [];

            // Auto Evaluation Logic
            for (const item of userAnswers) {
                const questionObj = assessment.questions.find(q => q._id.toString() === item.questionId);

                if (questionObj) {
                    let isCorrect = false;
                    let marksObtained = 0;

                    // Match String or Case-insensitive logic
                    if (String(questionObj.correctAnswer).trim().toLowerCase() === String(item.selectedAnswer).trim().toLowerCase()) {
                        isCorrect = true;
                        marksObtained = questionObj.marks;
                        totalScore += questionObj.marks;
                    } else if (questionObj.negativeMarks > 0 && item.selectedAnswer) {
                        // Negative Marking Logic
                        marksObtained = -questionObj.negativeMarks;
                        totalScore -= questionObj.negativeMarks;
                    }

                    evaluatedAnswers.push({
                        questionId: item.questionId,
                        selectedAnswer: item.selectedAnswer,
                        isCorrect,
                        marksObtained
                    });
                }
            }

            // Final Result Status
            const isPassed = totalScore >= assessment.passingMarks;

            // Save Attempt Data
            const attempt = new TestAttempt({
                candidateId: req.user._id,
                assessmentId,
                answers: evaluatedAnswers,
                score: Math.max(0, totalScore), // Avoid negative final score display
                totalMarks: assessment.totalMarks,
                status: 'completed',
                isPassed,
                completedAt: new Date()
            });

            await attempt.save();

            return res.status(200).json({
                success: true,
                message: 'Assessment submitted successfully!',
                result: {
                    attemptId: attempt._id,
                    score: attempt.score,
                    totalMarks: attempt.totalMarks,
                    passingMarks: assessment.passingMarks,
                    isPassed: attempt.isPassed,
                    status: attempt.status
                }
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // 4. Get Candidate's Test History & Results
    async getMyResults(req, res) {
        try {
            const attempts = await TestAttempt.find({ candidateId: req.user._id })
                .populate('assessmentId', 'title categoryIds');

            return res.status(200).json({
                success: true,
                count: attempts.length,
                data: attempts
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CandidateController();