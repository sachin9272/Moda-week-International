import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
    esmeraldaUserId: {
        type: String,
        sparse: true,
        index: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Super Admin', 'Admin Access'],
        default: 'Admin Access'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    permittedProjects: {
        type: [String],
        default: []
    },
    modaPermissions: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    source: {
        type: String,
        enum: ['esmeralda_master', 'local'],
        default: 'esmeralda_master'
    }
}, { timestamps: true });

adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
