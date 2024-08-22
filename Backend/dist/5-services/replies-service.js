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
exports.repliesService = void 0;
const populatedPath_1 = require("../2-utils/populatedPath");
const client_errors_1 = require("../3-models/client-errors");
const comment_model_1 = require("../3-models/comment-model");
const like_model_1 = require("../3-models/like-model");
const reply_model_1 = require("../3-models/reply-model");
class RepliesService {
    getOneReply(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reply = yield reply_model_1.ReplyModel.findById(_id)
                .populate(populatedPath_1.specialPopulatedFieldsReplyService)
                .exec();
            return reply;
        });
    }
    addReply(reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = reply.validateSync();
            if (errors) {
                throw new client_errors_1.ValidationError(errors.message);
            }
            yield reply.save();
            const comment = yield comment_model_1.CommentModel.findByIdAndUpdate(reply.commentId).exec();
            comment.replies.set(reply._id.toString(), reply);
            yield comment.save();
            const newComment = yield comment_model_1.CommentModel.findById(reply.commentId).populate(populatedPath_1.specialPopulatedFieldsCommentService).exec();
            return newComment.replies;
        });
    }
    updateReply(reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = reply.validateSync();
            if (errors) {
                throw new client_errors_1.ValidationError(errors.message);
            }
            const oldReply = yield reply_model_1.ReplyModel.findById(reply._id).exec();
            console.log({ oldReply: oldReply });
            if (!oldReply) {
                throw new client_errors_1.ResourceNotFoundError(reply._id);
            }
            reply.likes = oldReply.likes;
            if (oldReply.userId.toString() !== reply.userId.toString()) {
                throw new Error("Access denied");
            }
            yield reply_model_1.ReplyModel.findByIdAndUpdate(oldReply._id, reply, {
                new: true,
            }).exec();
            const comment = yield comment_model_1.CommentModel.findById(reply.commentId).exec();
            comment.replies.set(reply._id.toString(), reply);
            yield comment.save();
            const newComment = yield comment_model_1.CommentModel.findById(reply.commentId).populate(populatedPath_1.specialPopulatedFieldsCommentService).exec();
            return newComment.replies;
        });
    }
    deleteReply(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const replyToDelete = yield reply_model_1.ReplyModel.findById(_id).exec();
            if (!replyToDelete) {
                throw new client_errors_1.ResourceNotFoundError(_id);
            }
            yield like_model_1.LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(replyToDelete.likes)) } });
            yield reply_model_1.ReplyModel.findByIdAndDelete(_id).exec();
            const comment = yield comment_model_1.CommentModel.findById(replyToDelete.commentId);
            comment.replies.delete(_id);
            yield comment.save();
            const newComment = yield comment_model_1.CommentModel.findById(replyToDelete.commentId).populate(populatedPath_1.specialPopulatedFieldsCommentService).exec();
            return newComment.replies;
        });
    }
}
exports.repliesService = new RepliesService();
