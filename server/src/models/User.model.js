import mongoose from 'mongoose';
import connectDB from '../config/db';

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

export default mongoose.models('User', userSchema);