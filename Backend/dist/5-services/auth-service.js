var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cyber } from "../2-utils/cyber";
import { ValidationError } from "../3-models/client-errors";
import { RoleModel } from "../3-models/enums";
import { UserModel } from "../3-models/user-model";
class AuthService {
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = user.validateSync();
            if (errors) {
                throw new ValidationError(errors.message);
            }
            const isEmailTaken = yield this.isEmailTaken(user.userDetails.email);
            if (isEmailTaken) {
                throw new ValidationError("The email is taken choose a different email please");
            }
            user.userDetails.roleId = RoleModel.User;
            user.userDetails.password = cyber.hashPassword(user.userDetails.password);
            yield user.save();
            const token = cyber.getNewToken(user);
            return token;
        });
    }
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = credentials.validateSync();
            if (errors) {
                throw new ValidationError(errors.message);
            }
            credentials.password = cyber.hashPassword(credentials.password);
            const user = yield UserModel.findOne({
                "userDetails.email": { $eq: credentials.email },
                "userDetails.password": { $eq: credentials.password },
            }).exec();
            if (!user) {
                throw new ValidationError("Incorrect Email or Password");
            }
            const token = cyber.getNewToken(user);
            return token;
        });
    }
    isEmailTaken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const allEmails = yield UserModel.find({ "userDetails.email": email });
            return allEmails.length > 0;
        });
    }
}
export const authService = new AuthService();
