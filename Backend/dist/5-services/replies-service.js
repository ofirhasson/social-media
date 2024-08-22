var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { specialPopulatedFieldsCommentService, specialPopulatedFieldsReplyService } from "../2-utils/populatedPath";
import { ResourceNotFoundError, ValidationError } from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { LikeModel } from "../3-models/like-model";
import { ReplyModel } from "../3-models/reply-model";
class RepliesService {
    getOneReply(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reply = yield ReplyModel.findById(_id)
                .populate(specialPopulatedFieldsReplyService)
                .exec();
            return reply;
        });
    }
    addReply(reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = reply.validateSync();
            if (errors) {
                throw new ValidationError(errors.message);
            }
            yield reply.save();
            const comment = yield CommentModel.findByIdAndUpdate(reply.commentId).exec();
            comment.replies.set(reply._id.toString(), reply);
            yield comment.save();
            const newComment = yield CommentModel.findById(reply.commentId).populate(specialPopulatedFieldsCommentService).exec();
            return newComment.replies;
        });
    }
    updateReply(reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = reply.validateSync();
            if (errors) {
                throw new ValidationError(errors.message);
            }
            const oldReply = yield ReplyModel.findById(reply._id).exec();
            console.log({ oldReply: oldReply });
            if (!oldReply) {
                throw new ResourceNotFoundError(reply._id);
            }
            reply.likes = oldReply.likes;
            if (oldReply.userId.toString() !== reply.userId.toString()) {
                throw new Error("Access denied");
            }
            yield ReplyModel.findByIdAndUpdate(oldReply._id, reply, {
                new: true,
            }).exec();
            const comment = yield CommentModel.findById(reply.commentId).exec();
            comment.replies.set(reply._id.toString(), reply);
            yield comment.save();
            const newComment = yield CommentModel.findById(reply.commentId).populate(specialPopulatedFieldsCommentService).exec();
            return newComment.replies;
        });
    }
    deleteReply(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const replyToDelete = yield ReplyModel.findById(_id).exec();
            if (!replyToDelete) {
                throw new ResourceNotFoundError(_id);
            }
            yield LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(replyToDelete.likes)) } });
            yield ReplyModel.findByIdAndDelete(_id).exec();
            const comment = yield CommentModel.findById(replyToDelete.commentId);
            comment.replies.delete(_id);
            yield comment.save();
            const newComment = yield CommentModel.findById(replyToDelete.commentId).populate(specialPopulatedFieldsCommentService).exec();
            return newComment.replies;
        });
    }
}
export const repliesService = new RepliesService();
