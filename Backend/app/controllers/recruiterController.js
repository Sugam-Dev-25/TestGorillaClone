const Question = require('../models/Question');
const Assessment = require('../models/Assessment');
const TestAttempt = require('../models/TestAttempt');
const emailService = require('../services/emailService');
class RecruiterController {
    constructor() {
        this.createQuestion = this.createQuestion.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.createAssessment = this.createAssessment.bind(this);
        this.getAssessments = this.getAssessments.bind(this);
        this.publishAssessment = this.publishAssessment.bind(this);
        this.getAssessmentAnalytics = this.getAssessmentAnalytics.bind(this);
        this.inviteCandidate = this.inviteCandidate.bind(this);
    }

    // 1. Create Question API
    async createQuestion(req, res) {
        try {
            const { question, type, options, correctAnswer, marks, negativeMarks, difficulty, categoryId, explanation } = req.body;

            const newQuestion = new Question({
                recruiterId: req.user._id,
                question,
                type,
                options,
                correctAnswer,
                marks,
                negativeMarks: negativeMarks || 0,
                difficulty: difficulty || 'medium',
                categoryId,
                explanation: explanation || ''
            });

            await newQuestion.save();

            return res.status(201).json({
                success: true,
                message: 'Question created successfully in Question Bank!',
                data: newQuestion
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // 2. Get All Questions for Logged-in Recruiter
    async getQuestions(req, res) {
        try {
            const questions = await Question.find({ recruiterId: req.user._id }).populate('categoryId', 'name type');
            return res.status(200).json({
                success: true,
                count: questions.length,
                data: questions
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 3. Create Assessment API
    async createAssessment(req, res) {
        try {
            const { title, description, categoryIds, questions, durationMinutes, totalMarks, passingMarks, isPublic } = req.body;

            const newAssessment = new Assessment({
                title,
                description,
                categoryIds,
                recruiterId: req.user._id,
                questions,
                durationMinutes,
                totalMarks,
                passingMarks,
                isPublic: isPublic || false,
                status: 'draft'
            });

            await newAssessment.save();

            return res.status(201).json({
                success: true,
                message: 'Assessment created successfully as Draft!',
                data: newAssessment
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // 4. Get All Assessments for Recruiter
    async getAssessments(req, res) {
        try {
            const assessments = await Assessment.find({ recruiterId: req.user._id })
                .populate('categoryIds', 'name')
                .populate('questions', 'question marks type');

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

    // 5. Publish Assessment API
    async publishAssessment(req, res) {
        try {
            const { assessmentId } = req.params;

            const assessment = await Assessment.findOne({ _id: assessmentId, recruiterId: req.user._id });
            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    message: 'Assessment not found!'
                });
            }

            if (!assessment.questions || assessment.questions.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot publish an assessment with zero questions!'
                });
            }

            assessment.status = 'published';
            await assessment.save();

            return res.status(200).json({
                success: true,
                message: 'Assessment published successfully!',
                data: assessment
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get Analytics & Candidates' Results for a Specific Assessment
    async getAssessmentAnalytics(req, res) {
        try {
            const { assessmentId } = req.params;

            // Verify assessment ownership
            const assessment = await Assessment.findOne({ _id: assessmentId, recruiterId: req.user._id });
            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    message: 'Assessment not found or unauthorized!'
                });
            }

            // Fetch all candidate attempts for this assessment
            const attempts = await TestAttempt.find({ assessmentId })
                .populate('candidateId', 'name email phone profileImage')
                .sort({ score: -1 }); // Rank candidates by highest score

            const totalAttempts = attempts.length;
            const passedCount = attempts.filter(a => a.isPassed).length;
            const failedCount = totalAttempts - passedCount;
            const passRate = totalAttempts > 0 ? ((passedCount / totalAttempts) * 100).toFixed(2) + '%' : '0%';

            return res.status(200).json({
                success: true,
                summary: {
                    assessmentTitle: assessment.title,
                    totalCandidates: totalAttempts,
                    passedCount,
                    failedCount,
                    passRate
                },
                candidatesData: attempts
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async inviteCandidate(req, res) {
        try {
            const { assessmentId } = req.params;
            const { candidateEmail } = req.body;

            const assessment = await Assessment.findOne({ _id: assessmentId, recruiterId: req.user._id });
            if (!assessment) {
                return res.status(404).json({ success: false, message: 'Assessment not found!' });
            }

            const testLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/assessment/start/${assessment._id}`;

            await emailService.sendAssessmentInvite(candidateEmail, assessment.title, testLink);

            return res.status(200).json({
                success: true,
                message: `Invitation email sent successfully to ${candidateEmail}!`
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new RecruiterController();