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
exports.usersService = void 0;
const cyber_1 = require("../2-utils/cyber");
const imagesHandler_1 = require("../2-utils/imagesHandler");
const populatedPath_1 = require("../2-utils/populatedPath");
const client_errors_1 = require("../3-models/client-errors");
const comment_model_1 = require("../3-models/comment-model");
const like_model_1 = require("../3-models/like-model");
const post_model_1 = require("../3-models/post-model");
const reply_model_1 = require("../3-models/reply-model");
const user_model_1 = require("../3-models/user-model");
const auth_service_1 = require("./auth-service");
const post_service_1 = require("./post-service");
class UsersService {
    getPopulatedFields() {
        return [
            "friendRequests",
            "sentFriendRequests",
            "posts",
            "friends",
            "likedPosts",
        ];
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.UserModel.find()
                .populate(this.getPopulatedFields())
                .populate(populatedPath_1.getPopulatedSpecialFieldsUserService)
                .exec();
            const userDictionary = new Map();
            users.forEach(user => {
                userDictionary.set(user._id.toString(), user);
            });
            return userDictionary;
        });
    }
    getOneUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findById(_id)
                .populate(this.getPopulatedFields())
                .populate(populatedPath_1.getPopulatedSpecialFieldsUserService)
                .exec();
            if (!user) {
                throw new client_errors_1.ResourceNotFoundError(_id);
            }
            return user;
        });
    }
    sendFriendRequest(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield user_model_1.UserModel.findById(senderId).exec();
            const receiver = yield user_model_1.UserModel.findById(receiverId).exec();
            if (!sender) {
                throw new client_errors_1.ResourceNotFoundError(senderId);
            }
            if (!receiver) {
                throw new client_errors_1.ResourceNotFoundError(receiverId);
            }
            if (receiver.friendRequests.has(senderId) ||
                sender.sentFriendRequests.has(receiverId)) {
                throw new Error("Friend request already sent");
            }
            receiver.friendRequests.set(senderId, sender);
            sender.sentFriendRequests.set(receiverId, receiver);
            yield receiver.save();
            yield sender.save();
            const updatedSender = yield this.getOneUser(senderId);
            const updatedReceiver = yield this.getOneUser(receiverId);
            return { sender: updatedSender, receiver: updatedReceiver };
        });
    }
    acceptFriendRequest(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield user_model_1.UserModel.findById(senderId).exec();
            const receiver = yield user_model_1.UserModel.findById(receiverId).exec();
            if (!sender) {
                throw new client_errors_1.ResourceNotFoundError(senderId);
            }
            if (!receiver) {
                throw new client_errors_1.ResourceNotFoundError(receiverId);
            }
            if (!receiver.friendRequests.has(senderId)) {
                throw new Error("Friend request not found");
            }
            receiver.friends.set(senderId, sender);
            sender.friends.set(receiverId, receiver);
            receiver.friendRequests.delete(sender._id);
            sender.sentFriendRequests.delete(receiver._id);
            yield receiver.save();
            yield sender.save();
            const updatedSender = yield this.getOneUser(senderId);
            const updatedReceiver = yield this.getOneUser(receiverId);
            return { sender: updatedSender, receiver: updatedReceiver };
        });
    }
    declineFriendRequest(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield user_model_1.UserModel.findById(senderId).exec();
            const receiver = yield user_model_1.UserModel.findById(receiverId).exec();
            if (!sender) {
                throw new client_errors_1.ResourceNotFoundError(senderId);
            }
            if (!receiver) {
                throw new client_errors_1.ResourceNotFoundError(receiverId);
            }
            if (!receiver.friendRequests.has(senderId)) {
                throw new Error("Friend request not found");
            }
            receiver.friendRequests.delete(senderId);
            sender.sentFriendRequests.delete(receiverId);
            yield receiver.save();
            yield sender.save();
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield user_model_1.UserModel.findById(user._id);
            if (!existingUser) {
                throw new client_errors_1.ResourceNotFoundError(user._id);
            }
            if (user.userDetails.email &&
                user.userDetails.email !== existingUser.userDetails.email) {
                const isEmailTaken = yield auth_service_1.authService.isEmailTaken(user.userDetails.email);
                if (isEmailTaken) {
                    throw new client_errors_1.ValidationError("The email is taken. Please choose a different email.");
                }
            }
            if (user.userDetails.password &&
                user.userDetails.password !== existingUser.userDetails.password) {
                user.userDetails.password = cyber_1.cyber.hashPassword(user.userDetails.password);
            }
            else {
                user.userDetails.password = existingUser.userDetails.password;
            }
            user.friends = existingUser.friends;
            user.friendRequests = existingUser.friendRequests;
            user.sentFriendRequests = existingUser.sentFriendRequests;
            user.posts = existingUser.posts;
            user.profileAlbum = existingUser.profileAlbum;
            user.coverAlbum = existingUser.coverAlbum;
            if (user.profileImage) {
                user.profileAlbum.push(user.profileImage);
                const profilePost = new post_model_1.PostModel({
                    userId: user._id,
                    content: "Updated profile picture",
                    privacyOptions: "public",
                    imageNames: [user.profileImage],
                    likes: {},
                    comments: {},
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                user.posts.set(profilePost._id.toString(), profilePost);
                yield post_service_1.postService.createPost(profilePost);
            }
            if (user.coverImage) {
                user.coverAlbum.push(user.coverImage);
                const coverPost = new post_model_1.PostModel({
                    userId: user._id,
                    content: "Updated cover picture",
                    privacyOptions: "public",
                    imageNames: [user.coverImage],
                    likes: {},
                    comments: {},
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                user.posts.set(coverPost._id.toString(), coverPost);
                yield post_service_1.postService.createPost(coverPost);
            }
            const updatedUser = yield user_model_1.UserModel.findByIdAndUpdate(user._id, user, {
                new: true,
            }).populate(populatedPath_1.getPopulatedSpecialFieldsUserService).exec();
            if (!updatedUser) {
                throw new client_errors_1.ResourceNotFoundError(user._id);
            }
            return this.getOneUser(updatedUser._id);
        });
    }
    deleteUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToDelete = yield user_model_1.UserModel.findByIdAndDelete(_id).exec();
            if (!userToDelete) {
                throw new client_errors_1.ResourceNotFoundError(_id);
            }
            yield post_model_1.PostModel.deleteMany({ userId: _id }).exec();
            yield like_model_1.LikeModel.deleteMany({ userId: _id }).exec();
            yield comment_model_1.CommentModel.deleteMany({ userId: _id }).exec();
            yield reply_model_1.ReplyModel.deleteMany({ userId: _id }).exec();
            yield imagesHandler_1.imagesHandler.deleteImage(userToDelete.profileImage);
            yield imagesHandler_1.imagesHandler.deleteImage(userToDelete.coverImage);
            yield user_model_1.UserModel.updateMany({ [`friends.${_id}`]: _id }, { $unset: { [`friends.${_id}`]: true } }).exec();
            yield user_model_1.UserModel.updateMany({ [`friendRequests.${_id}`]: _id }, { $unset: { [`friendRequests.${_id}`]: true } }).exec();
            yield user_model_1.UserModel.updateMany({ [`sentFriendRequests.${_id}`]: _id }, { $unset: { [`sentFriendRequests.${_id}`]: true } }).exec();
        });
    }
}
exports.usersService = new UsersService();
