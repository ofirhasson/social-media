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
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const enums_1 = require("../3-models/enums");
const user_model_1 = require("../3-models/user-model");
const users_service_1 = require("../5-services/users-service");
const imagesHandler_1 = require("../2-utils/imagesHandler");
class UsersController {
    constructor() {
        this.router = express_1.default.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get("/users", this.getAllUsers);
        this.router.get("/users/user/:_id([a-f0-9A-F]{24})", this.getOneUser);
        this.router.put("/users/send-friend-request/:senderId([a-f0-9A-F]{24})/:receiverId([a-f0-9A-F]{24})", this.sendFriendRequest);
        this.router.put("/users/accept-friend-request/:senderId([a-f0-9A-F]{24})/:receiverId([a-f0-9A-F]{24})", this.acceptFriendRequest);
        this.router.put("/users/delete-friend-request/:senderId([a-f0-9A-F]{24})/:receiverId([a-f0-9A-F]{24})", this.declineFriendRequest);
        this.router.put("/users/user/:_id([a-f0-9A-F]{24})", this.updateUser);
        this.router.delete("/users/user/:_id([a-f0-9A-F]{24})", this.deleteUser);
        this.router.get("/social-media/images/:folderPath/:imageName/", imagesHandler_1.imagesHandler.getImageFile);
    }
    getAllUsers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield users_service_1.usersService.getAllUsers();
                response.json(users);
            }
            catch (err) {
                next(err);
            }
        });
    }
    getOneUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = request.params;
                const user = yield users_service_1.usersService.getOneUser(_id);
                response.json(user);
            }
            catch (err) {
                next(err);
            }
        });
    }
    sendFriendRequest(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId, receiverId } = request.params;
                const sentFriendRequest = yield users_service_1.usersService.sendFriendRequest(senderId, receiverId);
                response.status(enums_1.StatusCode.Created).json(sentFriendRequest);
            }
            catch (err) {
                next(err);
            }
        });
    }
    acceptFriendRequest(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId, receiverId } = request.params;
                const acceptFriendRequest = yield users_service_1.usersService.acceptFriendRequest(senderId, receiverId);
                response.status(enums_1.StatusCode.Created).json(acceptFriendRequest);
            }
            catch (err) {
                next(err);
            }
        });
    }
    declineFriendRequest(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId, receiverId } = request.params;
                yield users_service_1.usersService.declineFriendRequest(senderId, receiverId);
                response.sendStatus(enums_1.StatusCode.NoContent);
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                request.body._id = request.params._id;
                const profileImage = (_a = request === null || request === void 0 ? void 0 : request.files) === null || _a === void 0 ? void 0 : _a.profileImage;
                const coverImage = (_b = request === null || request === void 0 ? void 0 : request.files) === null || _b === void 0 ? void 0 : _b.coverImage;
                if (profileImage) {
                    imagesHandler_1.imagesHandler.configureFileSaver("1-assets", "posts-images");
                    const imageName = yield imagesHandler_1.imagesHandler.updateImage(user_model_1.UserModel, request.body._id, profileImage, enums_1.ImageType.ProfileImage);
                    request.body.profileImage = imageName;
                }
                if (coverImage) {
                    imagesHandler_1.imagesHandler.configureFileSaver("1-assets", "posts-images");
                    const imageName = yield imagesHandler_1.imagesHandler.updateImage(user_model_1.UserModel, request.body._id, coverImage, enums_1.ImageType.CoverImage);
                    request.body.coverImage = imageName;
                }
                const user = new user_model_1.UserModel(request.body);
                const updatedUser = yield users_service_1.usersService.updateUser(user);
                response.json(updatedUser);
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = request.params;
                yield users_service_1.usersService.deleteUser(_id);
                response.sendStatus(enums_1.StatusCode.NoContent);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
const userController = new UsersController();
exports.usersRouter = userController.router;
