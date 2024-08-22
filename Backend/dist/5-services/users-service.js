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
import { imagesHandler } from "../2-utils/imagesHandler";
import { getPopulatedSpecialFieldsUserService } from "../2-utils/populatedPath";
import { ResourceNotFoundError, ValidationError, } from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { LikeModel } from "../3-models/like-model";
import { PostModel } from "../3-models/post-model";
import { ReplyModel } from "../3-models/reply-model";
import { UserModel } from "../3-models/user-model";
import { authService } from "./auth-service";
import { postService } from "./post-service";
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
            const users = yield UserModel.find()
                .populate(this.getPopulatedFields())
                .populate(getPopulatedSpecialFieldsUserService)
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
            const user = yield UserModel.findById(_id)
                .populate(this.getPopulatedFields())
                .populate(getPopulatedSpecialFieldsUserService)
                .exec();
            if (!user) {
                throw new ResourceNotFoundError(_id);
            }
            return user;
        });
    }
    sendFriendRequest(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield UserModel.findById(senderId).exec();
            const receiver = yield UserModel.findById(receiverId).exec();
            if (!sender) {
                throw new ResourceNotFoundError(senderId);
            }
            if (!receiver) {
                throw new ResourceNotFoundError(receiverId);
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
            const sender = yield UserModel.findById(senderId).exec();
            const receiver = yield UserModel.findById(receiverId).exec();
            if (!sender) {
                throw new ResourceNotFoundError(senderId);
            }
            if (!receiver) {
                throw new ResourceNotFoundError(receiverId);
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
            const sender = yield UserModel.findById(senderId).exec();
            const receiver = yield UserModel.findById(receiverId).exec();
            if (!sender) {
                throw new ResourceNotFoundError(senderId);
            }
            if (!receiver) {
                throw new ResourceNotFoundError(receiverId);
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
            const existingUser = yield UserModel.findById(user._id);
            if (!existingUser) {
                throw new ResourceNotFoundError(user._id);
            }
            if (user.userDetails.email &&
                user.userDetails.email !== existingUser.userDetails.email) {
                const isEmailTaken = yield authService.isEmailTaken(user.userDetails.email);
                if (isEmailTaken) {
                    throw new ValidationError("The email is taken. Please choose a different email.");
                }
            }
            if (user.userDetails.password &&
                user.userDetails.password !== existingUser.userDetails.password) {
                user.userDetails.password = cyber.hashPassword(user.userDetails.password);
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
                const profilePost = new PostModel({
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
                yield postService.createPost(profilePost);
            }
            if (user.coverImage) {
                user.coverAlbum.push(user.coverImage);
                const coverPost = new PostModel({
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
                yield postService.createPost(coverPost);
            }
            const updatedUser = yield UserModel.findByIdAndUpdate(user._id, user, {
                new: true,
            }).populate(getPopulatedSpecialFieldsUserService).exec();
            if (!updatedUser) {
                throw new ResourceNotFoundError(user._id);
            }
            return this.getOneUser(updatedUser._id);
        });
    }
    deleteUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToDelete = yield UserModel.findByIdAndDelete(_id).exec();
            if (!userToDelete) {
                throw new ResourceNotFoundError(_id);
            }
            yield PostModel.deleteMany({ userId: _id }).exec();
            yield LikeModel.deleteMany({ userId: _id }).exec();
            yield CommentModel.deleteMany({ userId: _id }).exec();
            yield ReplyModel.deleteMany({ userId: _id }).exec();
            yield imagesHandler.deleteImage(userToDelete.profileImage);
            yield imagesHandler.deleteImage(userToDelete.coverImage);
            yield UserModel.updateMany({ [`friends.${_id}`]: _id }, { $unset: { [`friends.${_id}`]: true } }).exec();
            yield UserModel.updateMany({ [`friendRequests.${_id}`]: _id }, { $unset: { [`friendRequests.${_id}`]: true } }).exec();
            yield UserModel.updateMany({ [`sentFriendRequests.${_id}`]: _id }, { $unset: { [`sentFriendRequests.${_id}`]: true } }).exec();
        });
    }
}
export const usersService = new UsersService();
