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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const cyber_1 = require("../2-utils/cyber");
const client_errors_1 = require("../3-models/client-errors");
const enums_1 = require("../3-models/enums");
const user_model_1 = require("../3-models/user-model");
class AuthService {
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = user.validateSync();
            if (errors) {
                throw new client_errors_1.ValidationError(errors.message);
            }
            const isEmailTaken = yield this.isEmailTaken(user.userDetails.email);
            if (isEmailTaken) {
                throw new client_errors_1.ValidationError("The email is taken choose a different email please");
            }
            user.userDetails.roleId = enums_1.RoleModel.User;
            user.userDetails.password = cyber_1.cyber.hashPassword(user.userDetails.password);
            yield user.save();
            const token = cyber_1.cyber.getNewToken(user);
            return token;
        });
    }
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = credentials.validateSync();
            if (errors) {
                throw new client_errors_1.ValidationError(errors.message);
            }
            credentials.password = cyber_1.cyber.hashPassword(credentials.password);
            const user = yield user_model_1.UserModel.findOne({
                "userDetails.email": { $eq: credentials.email },
                "userDetails.password": { $eq: credentials.password },
            }).exec();
            if (!user) {
                throw new client_errors_1.ValidationError("Incorrect Email or Password");
            }
            const token = cyber_1.cyber.getNewToken(user);
            return token;
        });
    }
    isEmailTaken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const allEmails = yield user_model_1.UserModel.find({ "userDetails.email": email });
            return allEmails.length > 0;
        });
    }
}
exports.authService = new AuthService();
