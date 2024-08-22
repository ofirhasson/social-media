import dotenv from "dotenv";
dotenv.config();
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
export const appConfig = new AppConfig();
