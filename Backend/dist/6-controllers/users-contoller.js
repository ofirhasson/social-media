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
import { ImageType, StatusCode } from "../3-models/enums";
import { UserModel } from "../3-models/user-model";
import { usersService } from "../5-services/users-service";
import { imagesHandler } from "../2-utils/imagesHandler";
class UsersController {
    constructor() {
        this.router = express.Router();
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
        this.router.get("/social-media/images/:folderPath/:imageName/", imagesHandler.getImageFile);
    }
    getAllUsers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield usersService.getAllUsers();
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
                const user = yield usersService.getOneUser(_id);
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
                const sentFriendRequest = yield usersService.sendFriendRequest(senderId, receiverId);
                response.status(StatusCode.Created).json(sentFriendRequest);
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
                const acceptFriendRequest = yield usersService.acceptFriendRequest(senderId, receiverId);
                response.status(StatusCode.Created).json(acceptFriendRequest);
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
                yield usersService.declineFriendRequest(senderId, receiverId);
                response.sendStatus(StatusCode.NoContent);
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateUser(request, response, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                request.body._id = request.params._id;
                const profileImage = (_a = request === null || request === void 0 ? void 0 : request.files) === null || _a === void 0 ? void 0 : _a.profileImage;
                const coverImage = (_b = request === null || request === void 0 ? void 0 : request.files) === null || _b === void 0 ? void 0 : _b.coverImage;
                if (profileImage) {
                    imagesHandler.configureFileSaver("1-assets", "posts-images");
                    const imageName = yield imagesHandler.updateImage(UserModel, request.body._id, profileImage, ImageType.ProfileImage);
                    request.body.profileImage = imageName;
                }
                if (coverImage) {
                    imagesHandler.configureFileSaver("1-assets", "posts-images");
                    const imageName = yield imagesHandler.updateImage(UserModel, request.body._id, coverImage, ImageType.CoverImage);
                    request.body.coverImage = imageName;
                }
                const user = new UserModel(request.body);
                const updatedUser = yield usersService.updateUser(user);
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
                yield usersService.deleteUser(_id);
                response.sendStatus(StatusCode.NoContent);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
const userController = new UsersController();
export const usersRouter = userController.router;
