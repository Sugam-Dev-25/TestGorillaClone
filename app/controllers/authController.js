const authService = require('../services/AuthService');

class AuthController {
    constructor() {
        // Class method scope binding
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    // Register API
    async register(req, res, next) {
        try {
            const { name, email, password, role, phone } = req.body;
            const user = await authService.registerUser({ name, email, password, role, phone });
            
            return res.status(201).json({
                success: true,
                message: 'User registered successfully!',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Login API
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, token } = await authService.loginUser(email, password);

            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            return res.status(200).json({
                success: true,
                message: 'Login successful!',
                token,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    recruiterStatus: user.recruiterStatus
                }
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // Logout API
    async logout(req, res, next) {
        res.clearCookie('jwt');
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully!'
        });
    }
}

module.exports = new AuthController();