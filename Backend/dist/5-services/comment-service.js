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
exports.commentsService = void 0;
const populatedPath_1 = require("../2-utils/populatedPath");
const client_errors_1 = require("../3-models/client-errors");
const comment_model_1 = require("../3-models/comment-model");
const like_model_1 = require("../3-models/like-model");
const post_model_1 = require("../3-models/post-model");
const reply_model_1 = require("../3-models/reply-model");
class CommentService {
    getOneComment(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_model_1.CommentModel.findById(_id)
                .populate(populatedPath_1.specialPopulatedFieldsCommentService)
                .exec();
            return comment;
        });
    }
    addComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = comment.validateSync();
            if (errors) {
                throw new client_errors_1.ValidationError(errors.message);
            }
            const newComment = yield comment.save();
            const post = yield post_model_1.PostModel.findById(comment.targetPostId).exec();
            post.comments.set(newComment._id.toString(), newComment);
            yield post.save();
            const newPost = yield post_model_1.PostModel.findById(comment.targetPostId).populate(populatedPath_1.specialPopulatedFieldsPostService).exec();
            return newPost.comments;
        });
    }
    updateComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = comment.validateSync();
            if (errors) {
                throw new client_errors_1.ValidationError(errors.message);
            }
            const oldComment = yield comment_model_1.CommentModel.findById(comment._id).exec();
            if (!oldComment) {
                throw new client_errors_1.ResourceNotFoundError(comment._id);
            }
            comment.replies = oldComment.replies;
            comment.likes = oldComment.likes;
            if (oldComment.userId.toString() !== comment.userId.toString()) {
                throw new Error("Access denied");
            }
            const updatedComment = yield comment_model_1.CommentModel.findByIdAndUpdate(comment._id, comment, { new: true });
            const post = yield post_model_1.PostModel.findById(comment === null || comment === void 0 ? void 0 : comment.targetPostId).exec();
            if (!post) {
                throw new client_errors_1.ResourceNotFoundError(post._id);
            }
            if (!post.comments.has(comment._id.toString())) {
                throw new client_errors_1.ResourceNotFoundError(comment._id);
            }
            post.comments.set(comment._id.toString(), updatedComment);
            yield post.save();
            const newPost = yield post_model_1.PostModel.findById(comment === null || comment === void 0 ? void 0 : comment.targetPostId).populate(populatedPath_1.specialPopulatedFieldsPostService).exec();
            return newPost.comments;
        });
    }
    deleteComment(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentToDelete = yield comment_model_1.CommentModel.findByIdAndDelete(_id).exec();
            if (!commentToDelete) {
                throw new client_errors_1.ResourceNotFoundError(_id);
            }
            yield this.deleteLikesAndReplies(commentToDelete);
            const post = yield post_model_1.PostModel.findById(commentToDelete.targetPostId).exec();
            post.comments.delete(_id);
            yield post.save();
            const updatedPost = yield post_model_1.PostModel.findById(commentToDelete.targetPostId).populate(populatedPath_1.specialPopulatedFieldsPostService).exec();
            return updatedPost.comments;
        });
    }
    deleteLikesAndReplies(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield like_model_1.LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(comment.likes)) } }).exec();
            if (comment.replies.size > 0) {
                for (const replyId of Object.keys(Object.fromEntries(comment.replies))) {
                    const newReply = yield reply_model_1.ReplyModel.findById(replyId);
                    yield like_model_1.LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(newReply.likes)) } });
                    yield reply_model_1.ReplyModel.findByIdAndDelete(replyId);
                }
            }
        });
    }
}
exports.commentsService = new CommentService();
