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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const credentials_model_1 = require("../3-models/credentials-model");
const enums_1 = require("../3-models/enums");
const user_model_1 = require("../3-models/user-model");
const auth_service_1 = require("../5-services/auth-service");
class AuthController {
    constructor() {
        this.router = express_1.default.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post("/register", this.register);
        this.router.post("/login", this.login);
    }
    register(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_model_1.UserModel(request.body);
                const token = yield auth_service_1.authService.register(user);
                response.status(enums_1.StatusCode.Created).json(token);
            }
            catch (err) {
                next(err);
            }
        });
    }
    login(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new credentials_model_1.CredentialsModel(request.body);
                const token = yield auth_service_1.authService.login(user);
                response.json(token);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
const authController = new AuthController();
exports.authRouter = authController.router;
