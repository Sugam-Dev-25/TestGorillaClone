const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
    // Register New User Logic
    async registerUser(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email is already registered!');
        }

        const user = new User(userData);
        await user.save();
        return user;
    }

    // Login Logic
    async loginUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password!');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid email or password!');
        }

        if (!user.isActive) {
            throw new Error('Your account is deactivated. Contact Admin.');
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        return { user, token };
    }
}

module.exports = new AuthService();