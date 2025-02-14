"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const KEY = process.env.SECRET_KEY;
if (!KEY) {
    throw new Error("Secret key undefined");
}
const UserMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        res.status(401).json({ error: "Access Denied" });
        return;
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, KEY);
        if (decode && decode.id) {
            req.userId = decode.id;
            next();
        }
        else {
            res.status(403).json({ message: "Invalid token payload" });
        }
    }
    catch (error) {
        console.error(error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ error: "Token expired" });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ error: "Invalid token" });
        }
        else {
            res.status(500).json({ error: "Unable to decode the JWT" });
        }
    }
};
exports.UserMiddleware = UserMiddleware;
