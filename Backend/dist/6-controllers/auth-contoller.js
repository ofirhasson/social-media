var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { CredentialsModel } from "../3-models/credentials-model";
import { StatusCode } from "../3-models/enums";
import { UserModel } from "../3-models/user-model";
import { authService } from "../5-services/auth-service";
class AuthController {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post("/register", this.register);
        this.router.post("/login", this.login);
    }
    register(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new UserModel(request.body);
                const token = yield authService.register(user);
                response.status(StatusCode.Created).json(token);
            }
            catch (err) {
                next(err);
            }
        });
    }
    login(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new CredentialsModel(request.body);
                const token = yield authService.login(user);
                response.json(token);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
const authController = new AuthController();
export const authRouter = authController.router;
