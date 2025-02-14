"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = require("./db");
const validation_1 = require("./validation");
const middleware_1 = require("./middleware");
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', router);
const config = {
    MONGODB_URL: process.env.MONGODB_URL
};
if (!config.MONGODB_URL) {
    throw new Error("MONGODB_URL environment variable is not defined");
}
mongoose_1.default.connect(config.MONGODB_URL)
    .then(() => console.log("MONGODB connected"))
    .catch((error) => console.log("MONGODB connection error ", error));
router.post("/v1/Register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validateInput = validation_1.registerSchema.safeParse(req.body);
    if (!validateInput.success) {
        res.status(400).json({
            error: "Input format error",
            details: validateInput.error.errors
        });
        return;
    }
    const { username, email, password } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.userModel.create({
            username: username,
            email: email,
            password: hashedPassword,
        });
        res.status(200).json({
            msg: "Use created Successfully"
        });
    }
    catch (error) {
        console.error("Error in creating user or User already exits", error),
            res.status(500).json({
                error: "Internal server error "
            });
    }
}));
router.post("/v1/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield db_1.userModel.findOne({ email });
        if (!user || !user.password) {
            res.status(404).json({
                error: "User not found "
            });
            return;
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                error: "Invalid credentials"
            });
            return;
        }
        if (!SECRET_KEY) {
            throw new Error("SECRET_KEY Exist undefined");
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, SECRET_KEY);
        res.status(200).json({
            token,
            message: "Login successfull"
        });
    }
    catch (error) {
        console.error("Error during login", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}));
router.post("/v1/content", middleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    const userId = req.userId;
    if (!title || !type || !userId) {
        res.status(401).json({
            error: "Missing required fields: title, type, or userId",
        });
    }
    try {
        yield db_1.ContentModel.create({
            link,
            type,
            title,
            userId,
            tags: [],
        });
        res.status(200).json({
            message: "Content Added successfully"
        });
        return;
    }
    catch (error) {
        console.error("Error in adding conent:", error);
        res.status(500).json({
            error: "internal server error "
        });
    }
}));
router.get("/v1/content", middleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
}));
router.delete("/v1/content", middleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    if (!contentId) {
        res.json({
            error: "Id does not exist"
        });
    }
    yield db_1.ContentModel.deleteMany({
        contentId,
        userId: req.userId
    });
    res.json({
        message: "Deleted"
    });
}));
router.post("/v1/brain/share", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
router.post("/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
app.listen(PORT, function () {
    console.log(`Server is running on http://localhost:${PORT}`);
});
