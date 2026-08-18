const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthMiddleware {
    // 1. JWT Token Verification (Check if logged in)
    async isAuthenticated(req, res, next) {
        try {
            let token;

            // Check Cookie first, then Authorization Header
            if (req.cookies && req.cookies.jwt) {
                token = req.cookies.jwt;
            } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. Please login to continue.'
                });
            }

            // Verify JWT Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User no longer exists.'
                });
            }

            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Account is deactivated. Contact Admin.'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please login again.'
            });
        }
    }

    // 2. Role Based Access Control (RBAC)
    authorizeRoles(...roles) {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: `Role (${req.user.role}) is not allowed to access this resource.`
                });
            }

            // Recruiter Approval Check
            if (req.user.role === 'recruiter' && req.user.recruiterStatus !== 'approved') {
                return res.status(403).json({
                    success: false,
                    message: 'Your recruiter account is pending Admin approval.'
                });
            }

            next();
        };
    }
}

module.exports = new AuthMiddleware();