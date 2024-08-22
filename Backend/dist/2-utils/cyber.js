import jwt from "jsonwebtoken";
import { appConfig } from "./app-config";
import crypto from "crypto";
import { RoleModel } from "../3-models/enums";
class Cyber {
    getNewToken(user) {
        delete user.userDetails.password;
        const container = { user };
        const options = { expiresIn: "5h" };
        const token = jwt.sign(container, appConfig.jwtSecretKey, options);
        return token;
    }
    isTokenValid(token) {
        try {
            if (!token)
                return false;
            jwt.verify(token, appConfig.jwtSecretKey);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    isAdmin(token) {
        const container = jwt.decode(token);
        const user = container.user;
        return user.userDetails.roleId === RoleModel.Admin;
    }
    hashPassword(plainText) {
        const hashedPassword = crypto
            .createHmac("sha512", appConfig.passwordSalt)
            .update(plainText)
            .digest("hex");
        return hashedPassword;
    }
}
export const cyber = new Cyber();
