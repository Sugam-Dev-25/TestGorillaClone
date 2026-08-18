const User = require('../models/User');
const Category = require('../models/Category');

class AdminController {
    constructor() {
        this.createCategory = this.createCategory.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.getPendingRecruiters = this.getPendingRecruiters.bind(this);
        this.approveRecruiter = this.approveRecruiter.bind(this);
    }

    // Create Category API
    async createCategory(req, res) {
        try {
            const { name, description, type } = req.body;

            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists!'
                });
            }

            const category = new Category({ name, description, type });
            await category.save();

            return res.status(201).json({
                success: true,
                message: 'Category created successfully!',
                data: category
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get All Active Categories API
    async getCategories(req, res) {
        try {
            const categories = await Category.find({ status: 'active' });
            return res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get Pending Recruiters List API
    async getPendingRecruiters(req, res) {
        try {
            const pendingRecruiters = await User.find({ role: 'recruiter', recruiterStatus: 'pending' }).select('-password');
            return res.status(200).json({
                success: true,
                count: pendingRecruiters.length,
                data: pendingRecruiters
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Approve Recruiter Account API
    async approveRecruiter(req, res) {
        try {
            const { recruiterId } = req.params;

            const recruiter = await User.findById(recruiterId);
            if (!recruiter || recruiter.role !== 'recruiter') {
                return res.status(404).json({
                    success: false,
                    message: 'Recruiter not found!'
                });
            }

            recruiter.recruiterStatus = 'approved';
            await recruiter.save();

            return res.status(200).json({
                success: true,
                message: 'Recruiter account approved successfully!',
                data: {
                    id: recruiter._id,
                    name: recruiter.name,
                    email: recruiter.email,
                    recruiterStatus: recruiter.recruiterStatus
                }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AdminController();