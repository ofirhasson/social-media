"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AppConfig {
    constructor() {
        this.isDevelopment = process.env.ENVIRONMENT === "development";
        this.isProduction = process.env.ENVIRONMENT === "production";
        this.port = process.env.PORT;
        this.mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING;
        this.jwtSecretKey = process.env.JWT_SECRET_KEY;
        this.passwordSalt = process.env.PASSWORD_SALT;
        this.commentImageUrl = process.env.COMMENT_IMAGE_URL;
        this.postsImageUrl = process.env.POSTS_IMAGE_URL;
    }
}
exports.appConfig = new AppConfig();
