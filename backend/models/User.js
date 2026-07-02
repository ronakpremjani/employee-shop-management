const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [ true,"name is required"],
            trim: true
        },

        email:{
            type: String,
            required: [true,"email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false
        },

        phone:{
            type: String,
            required: [true,'phone_no is require']
        },

        role: {
            type: String,
            enum: ['admin', 'staff'],
            default: 'staff'
        },

        salary:{
            type: Number,
            default: 0
        },

        profilePicture:{
            type: String,
            default: ''
        },

        joiningDate: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active'
        },

        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
            timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);