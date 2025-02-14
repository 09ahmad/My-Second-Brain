import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
    }
})
export const userModel = model("User", UserSchema);

const contentType = ['image', 'video', 'article', 'audio']
const ContentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentType, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }

})

export const ContentModel = model('Content', ContentSchema);

// const TagSchema = new Schema({
//     title: { type: String, required: true, unique: true }
// })

// export const Tag = mongoose.model('Tag', TagSchema);


// export const LinkSchema = new Schema({
//     hash: { type: String, required: true },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
// })
// export const LinkModel = model("Link", LinkSchema);