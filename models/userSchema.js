import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowecase: true,
        required: true
    },
    password:{
        type:String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User',userSchema);

export default User;