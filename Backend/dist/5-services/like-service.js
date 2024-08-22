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
exports.likeService = void 0;
const populatedPath_1 = require("../2-utils/populatedPath");
const client_errors_1 = require("../3-models/client-errors");
const comment_model_1 = require("../3-models/comment-model");
const enums_1 = require("../3-models/enums");
const like_model_1 = require("../3-models/like-model");
const post_model_1 = require("../3-models/post-model");
const reply_model_1 = require("../3-models/reply-model");
const user_model_1 = require("../3-models/user-model");
class LikeService {
    addLike(like) {
        return __awaiter(this, void 0, void 0, function* () {
            let targetExists;
            switch (like.targetType) {
                case enums_1.LikeTarget.Post:
                    targetExists =
                        (yield post_model_1.PostModel.exists({ _id: like.targetId })) !== null;
                    break;
                case enums_1.LikeTarget.Comment:
                    targetExists =
                        (yield comment_model_1.CommentModel.exists({ _id: like.targetId })) !== null;
                    break;
                case enums_1.LikeTarget.Reply:
                    targetExists =
                        (yield reply_model_1.ReplyModel.exists({ _id: like.targetId })) !== null;
                    break;
                default:
                    throw new Error("Invalid target type");
            }
            if (!targetExists) {
                throw new client_errors_1.ResourceNotFoundError(like.targetId.toString());
            }
            const existingLike = yield like_model_1.LikeModel.findOne({ userId: like.userId, targetId: like.targetId, targetType: like.targetType });
            if (existingLike) {
                throw new Error("You have already liked this target");
            }
            const addedLike = yield like.save();
            let likesDictionary;
            if (like.targetType === enums_1.LikeTarget.Post) {
                const post = yield post_model_1.PostModel.findById(like.targetId);
                post.likes.set(like.userId.toString(), addedLike);
                yield post.save();
                const user = yield user_model_1.UserModel.findById(like.userId);
                user.likedPosts.set(like.userId.toString(), post);
                yield user.save();
                likesDictionary = (yield post_model_1.PostModel.findById(like.targetId).populate(populatedPath_1.specialPopulatedFieldsPostService)).likes;
            }
            if (like.targetType === enums_1.LikeTarget.Comment) {
                const comment = yield comment_model_1.CommentModel.findById(like.targetId);
                comment.likes.set(like.userId.toString(), addedLike);
                yield comment.save();
                likesDictionary = (yield comment_model_1.CommentModel.findById(like.targetId).populate(populatedPath_1.specialPopulatedFieldsCommentService)).likes;
            }
            if (like.targetType === enums_1.LikeTarget.Reply) {
                const reply = yield reply_model_1.ReplyModel.findById(like.targetId);
                reply.likes.set(like.userId.toString(), addedLike);
                yield reply.save();
                likesDictionary = (yield reply_model_1.ReplyModel.findById(like.targetId).populate(populatedPath_1.specialPopulatedFieldsReplyService)).likes;
            }
            return likesDictionary;
        });
    }
    removeLike(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLike = yield like_model_1.LikeModel.findById(_id);
            if (!existingLike) {
                throw new client_errors_1.ResourceNotFoundError("Like not exist");
            }
            if (![enums_1.LikeTarget.Post, enums_1.LikeTarget.Comment, enums_1.LikeTarget.Reply].includes(existingLike.targetType)) {
                throw new Error("Invalid target type");
            }
            yield like_model_1.LikeModel.findByIdAndDelete(existingLike._id);
            let likesDictionary;
            if (existingLike.targetType === enums_1.LikeTarget.Post) {
                const post = yield post_model_1.PostModel.findById(existingLike.targetId);
                post.likes.delete(existingLike.userId.toString());
                yield post.save();
                const user = yield user_model_1.UserModel.findById(existingLike.userId);
                user.likedPosts.delete(existingLike.targetId.toString());
                yield user.save();
                likesDictionary = (yield post_model_1.PostModel.findById(existingLike.targetId).populate(populatedPath_1.specialPopulatedFieldsPostService)).likes;
            }
            if (existingLike.targetType === enums_1.LikeTarget.Comment) {
                const comment = yield comment_model_1.CommentModel.findById(existingLike.targetId);
                comment.likes.delete(existingLike.userId.toString());
                yield comment.save();
                likesDictionary = (yield comment_model_1.CommentModel.findById(existingLike.targetId).populate(populatedPath_1.specialPopulatedFieldsCommentService)).likes;
            }
            if (existingLike.targetType === enums_1.LikeTarget.Reply) {
                const reply = yield reply_model_1.ReplyModel.findById(existingLike.targetId);
                reply.likes.delete(existingLike.userId.toString());
                yield reply.save();
                likesDictionary = (yield reply_model_1.ReplyModel.findById(existingLike.targetId).populate(populatedPath_1.specialPopulatedFieldsReplyService)).likes;
            }
            return likesDictionary || new Map();
        });
    }
}
exports.likeService = new LikeService();
