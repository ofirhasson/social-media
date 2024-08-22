var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { imagesHandler } from "../2-utils/imagesHandler";
import { specialPopulatedFieldsPostService } from "../2-utils/populatedPath";
import { ResourceNotFoundError, ValidationError, } from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { PrivacyOptions } from "../3-models/enums";
import { LikeModel } from "../3-models/like-model";
import { PostModel } from "../3-models/post-model";
import { UserModel } from "../3-models/user-model";
import { commentsService } from "./comment-service";
class PostService {
    populatedFields() {
        return ["userId", "comments", "likes"];
    }
    getAllPostsByTargetUser(userId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel.findById(userId).exec();
            if (!user) {
                throw new ResourceNotFoundError(userId);
            }
            const friends = Object.fromEntries(user.friends);
            let query = {};
            if (!targetUserId) {
                query = {
                    $or: [
                        { privacyOptions: PrivacyOptions.Public },
                        { privacyOptions: PrivacyOptions.Friends, userId: { $in: Object.keys(friends) } },
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
                            privacyOptions: PrivacyOptions.Friends,
                            userId: { $in: Object.keys(friends) },
                            targetUserId: targetUserId,
                        },
                    ],
                };
            }
            else {
                const targetUser = yield UserModel.findById(targetUserId).exec();
                if (!targetUser) {
                    throw new ResourceNotFoundError(targetUserId);
                }
                query = {
                    $or: [
                        { userId: userId, targetUserId: targetUserId },
                        {
                            privacyOptions: PrivacyOptions.Private,
                            userId: targetUserId,
                            targetUserId: userId,
                        },
                        { privacyOptions: PrivacyOptions.Public, userId: targetUserId },
                        { privacyOptions: PrivacyOptions.Friends, userId: { $in: Object.keys(friends) } },
                    ],
                };
            }
            const posts = yield PostModel.find(query)
                .populate(specialPopulatedFieldsPostService)
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
            const post = yield PostModel.findById(postId)
                .populate(specialPopulatedFieldsPostService)
                .exec();
            if (!post) {
                throw new ResourceNotFoundError(postId);
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
                throw new ValidationError(errors.message);
            }
            if (post.imageNames && post.imageNames.length > 0) {
                yield UserModel.findByIdAndUpdate(post.userId, {
                    $push: { postsAlbum: { $each: post.imageNames } },
                }).exec();
            }
            const newPost = yield post.save();
            const user = yield UserModel.findById(post.userId).exec();
            user.posts.set(newPost._id.toString(), newPost);
            yield user.save();
            return this.getPostById(newPost === null || newPost === void 0 ? void 0 : newPost._id, newPost === null || newPost === void 0 ? void 0 : newPost.userId.toString());
        });
    }
    updatePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = post.validateSync();
            if (errors) {
                throw new ValidationError(errors.message);
            }
            const oldPost = yield PostModel.findById(post._id).exec();
            if (!oldPost) {
                throw new ResourceNotFoundError(post._id);
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
                yield UserModel.findByIdAndUpdate(post.userId, {
                    $push: { postsAlbum: { $each: post.imageNames } },
                }).exec();
            }
            const updatedPost = yield PostModel.findByIdAndUpdate(post._id, post, {
                new: true,
            }).exec();
            if (!updatedPost) {
                throw new ResourceNotFoundError(post._id);
            }
            const user = yield UserModel.findById(post.userId).exec();
            user.posts.set(post._id.toString(), post);
            yield user.save();
            return this.getPostById(updatedPost._id, post.userId.toString());
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postToDelete = yield PostModel.findById(postId).exec();
            if (!postToDelete) {
                throw new ResourceNotFoundError(postId);
            }
            const comments = yield CommentModel.find({
                _id: { $in: Object.keys(Object.fromEntries(postToDelete.comments)) },
            }).exec();
            for (const comment of comments) {
                yield commentsService.deleteComment(comment._id);
            }
            yield LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(postToDelete.likes)) } }).exec();
            yield UserModel.updateOne({ _id: postToDelete.userId, [`posts.${postId}`]: postId }, { $unset: { [`posts.${postId}`]: true } }).exec();
            yield UserModel.updateOne({ _id: postToDelete.userId }, { $pullAll: { postsAlbum: postToDelete.imageNames } }).exec();
            yield UserModel.updateMany({ [`likedPosts.${postId}`]: postId }, { $unset: { [`likedPosts.${postId}`]: true } }).exec();
            yield imagesHandler.deleteImagesArr(postToDelete.imageNames);
            yield PostModel.findByIdAndDelete(postId).exec();
        });
    }
}
export const postService = new PostService();
