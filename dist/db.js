"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const UserSchema = new mongoose_2.Schema({
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
});
exports.userModel = (0, mongoose_2.model)("User", UserSchema);
const contentType = ['image', 'video', 'article', 'audio'];
const ContentSchema = new mongoose_2.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentType, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true }
});
exports.ContentModel = (0, mongoose_2.model)('Content', ContentSchema);
// const TagSchema = new Schema({
//     title: { type: String, required: true, unique: true }
// })
// export const Tag = mongoose.model('Tag', TagSchema);
// export const LinkSchema = new Schema({
//     hash: { type: String, required: true },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
// })
// export const LinkModel = model("Link", LinkSchema);
