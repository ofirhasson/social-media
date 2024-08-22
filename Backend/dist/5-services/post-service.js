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
exports.postService = void 0;
const imagesHandler_1 = require("../2-utils/imagesHandler");
const populatedPath_1 = require("../2-utils/populatedPath");
const client_errors_1 = require("../3-models/client-errors");
const comment_model_1 = require("../3-models/comment-model");
const enums_1 = require("../3-models/enums");
const like_model_1 = require("../3-models/like-model");
const post_model_1 = require("../3-models/post-model");
const user_model_1 = require("../3-models/user-model");
const comment_service_1 = require("./comment-service");
class PostService {
    populatedFields() {
        return ["userId", "comments", "likes"];
    }
    getAllPostsByTargetUser(userId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findById(userId).exec();
            if (!user) {
                throw new client_errors_1.ResourceNotFoundError(userId);
            }
            const friends = Object.fromEntries(user.friends);
            let query = {};
            if (!targetUserId) {
                query = {
                    $or: [
                        { privacyOptions: enums_1.PrivacyOptions.Public },
                        { privacyOptions: enums_1.PrivacyOptions.Friends, userId: { $in: Object.keys(friends) } },
                        { userId: userId },
                    ],
                };
            }
            else if (userId === targetUserId) {
                query = {
                    $or: [
                        { userId: userId },
                        { targetUserId: userId },
                        {
                            privacyOptions: enums_1.PrivacyOptions.Friends,
                            userId: { $in: Object.keys(friends) },
                            targetUserId: targetUserId,
                        },
                    ],
                };
            }
            else {
                const targetUser = yield user_model_1.UserModel.findById(targetUserId).exec();
                if (!targetUser) {
                    throw new client_errors_1.ResourceNotFoundError(targetUserId);
                }
                query = {
                    $or: [
                        { userId: userId, targetUserId: targetUserId },
                        {
                            privacyOptions: enums_1.PrivacyOptions.Private,
                            userId: targetUserId,
                            targetUserId: userId,
                        },
                        { privacyOptions: enums_1.PrivacyOptions.Public, userId: targetUserId },
                        { privacyOptions: enums_1.PrivacyOptions.Friends, userId: { $in: Object.keys(friends) } },
                    ],
                };
            }
            const posts = yield post_model_1.PostModel.find(query)
                .populate(populatedPath_1.specialPopulatedFieldsPostService)
                .exec();
            const postDictionary = new Map();
            posts.forEach((post) => {
                postDictionary[post._id.toString()] = post;
            });
            return postDictionary;
        });
    }
    getPostById(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_model_1.PostModel.findById(postId)
                .populate(populatedPath_1.specialPopulatedFieldsPostService)
                .exec();
            if (!post) {
                throw new client_errors_1.ResourceNotFoundError(postId);
            }
            const postUserIdStr = post.userId.toString();
            const userIdStr = userId.toString();
            if (postUserIdStr === userIdStr) {
                return post;
            }
            return post;
        });
    }
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = post.validateSync();
            if (errors) {
                throw new client_errors_1.ValidationError(errors.message);
            }
            if (post.imageNames && post.imageNames.length > 0) {
                yield user_model_1.UserModel.findByIdAndUpdate(post.userId, {
                    $push: { postsAlbum: { $each: post.imageNames } },
                }).exec();
            }
            const newPost = yield post.save();
            const user = yield user_model_1.UserModel.findById(post.userId).exec();
            user.posts.set(newPost._id.toString(), newPost);
            yield user.save();
            return this.getPostById(newPost === null || newPost === void 0 ? void 0 : newPost._id, newPost === null || newPost === void 0 ? void 0 : newPost.userId.toString());
        });
    }
    updatePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = post.validateSync();
            if (errors) {
                throw new client_errors_1.ValidationError(errors.message);
            }
            const oldPost = yield post_model_1.PostModel.findById(post._id).exec();
            if (!oldPost) {
                throw new client_errors_1.ResourceNotFoundError(post._id);
            }
            if (oldPost.userId.toString() !== post.userId.toString()) {
                throw new Error("Access denied");
            }
            post.comments = oldPost.comments;
            post.likes = oldPost.likes;
            if (post.imageNames.length === 0) {
                post.imageNames = oldPost === null || oldPost === void 0 ? void 0 : oldPost.imageNames;
            }
            else {
                yield user_model_1.UserModel.findByIdAndUpdate(post.userId, {
                    $push: { postsAlbum: { $each: post.imageNames } },
                }).exec();
            }
            const updatedPost = yield post_model_1.PostModel.findByIdAndUpdate(post._id, post, {
                new: true,
            }).exec();
            if (!updatedPost) {
                throw new client_errors_1.ResourceNotFoundError(post._id);
            }
            const user = yield user_model_1.UserModel.findById(post.userId).exec();
            user.posts.set(post._id.toString(), post);
            yield user.save();
            return this.getPostById(updatedPost._id, post.userId.toString());
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postToDelete = yield post_model_1.PostModel.findById(postId).exec();
            if (!postToDelete) {
                throw new client_errors_1.ResourceNotFoundError(postId);
            }
            const comments = yield comment_model_1.CommentModel.find({
                _id: { $in: Object.keys(Object.fromEntries(postToDelete.comments)) },
            }).exec();
            for (const comment of comments) {
                yield comment_service_1.commentsService.deleteComment(comment._id);
            }
            yield like_model_1.LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(postToDelete.likes)) } }).exec();
            yield user_model_1.UserModel.updateOne({ _id: postToDelete.userId, [`posts.${postId}`]: postId }, { $unset: { [`posts.${postId}`]: true } }).exec();
            yield user_model_1.UserModel.updateOne({ _id: postToDelete.userId }, { $pullAll: { postsAlbum: postToDelete.imageNames } }).exec();
            yield user_model_1.UserModel.updateMany({ [`likedPosts.${postId}`]: postId }, { $unset: { [`likedPosts.${postId}`]: true } }).exec();
            yield imagesHandler_1.imagesHandler.deleteImagesArr(postToDelete.imageNames);
            yield post_model_1.PostModel.findByIdAndDelete(postId).exec();
        });
    }
}
exports.postService = new PostService();
