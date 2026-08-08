const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    assessmentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Assessment', 
        default: null 
    },
    recruiterId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    question: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['mcq', 'multi-select', 'true-false', 'fill-blank', 'short-answer'], 
        required: true 
    },
    options: [{ 
        type: String 
    }],
    correctAnswer: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true 
    },
    marks: { 
        type: Number, 
        required: true 
    },
    negativeMarks: { 
        type: Number, 
        default: 0 
    },
    difficulty: { 
        type: String, 
        enum: ['easy', 'medium', 'hard'], 
        default: 'medium' 
    },
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category' 
    },
    explanation: { 
        type: String, 
        default: '' 
    },
    image: { 
        type: String, 
        default: '' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);