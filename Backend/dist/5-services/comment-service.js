var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { specialPopulatedFieldsCommentService, specialPopulatedFieldsPostService } from "../2-utils/populatedPath";
import { ResourceNotFoundError, ValidationError } from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { LikeModel } from "../3-models/like-model";
import { PostModel } from "../3-models/post-model";
import { ReplyModel } from "../3-models/reply-model";
class CommentService {
    getOneComment(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield CommentModel.findById(_id)
                .populate(specialPopulatedFieldsCommentService)
                .exec();
            return comment;
        });
    }
    addComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = comment.validateSync();
            if (errors) {
                throw new ValidationError(errors.message);
            }
            const newComment = yield comment.save();
            const post = yield PostModel.findById(comment.targetPostId).exec();
            post.comments.set(newComment._id.toString(), newComment);
            yield post.save();
            const newPost = yield PostModel.findById(comment.targetPostId).populate(specialPopulatedFieldsPostService).exec();
            return newPost.comments;
        });
    }
    updateComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = comment.validateSync();
            if (errors) {
                throw new ValidationError(errors.message);
            }
            const oldComment = yield CommentModel.findById(comment._id).exec();
            if (!oldComment) {
                throw new ResourceNotFoundError(comment._id);
            }
            comment.replies = oldComment.replies;
            comment.likes = oldComment.likes;
            if (oldComment.userId.toString() !== comment.userId.toString()) {
                throw new Error("Access denied");
            }
            const updatedComment = yield CommentModel.findByIdAndUpdate(comment._id, comment, { new: true });
            const post = yield PostModel.findById(comment === null || comment === void 0 ? void 0 : comment.targetPostId).exec();
            if (!post) {
                throw new ResourceNotFoundError(post._id);
            }
            if (!post.comments.has(comment._id.toString())) {
                throw new ResourceNotFoundError(comment._id);
            }
            post.comments.set(comment._id.toString(), updatedComment);
            yield post.save();
            const newPost = yield PostModel.findById(comment === null || comment === void 0 ? void 0 : comment.targetPostId).populate(specialPopulatedFieldsPostService).exec();
            return newPost.comments;
        });
    }
    deleteComment(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentToDelete = yield CommentModel.findByIdAndDelete(_id).exec();
            if (!commentToDelete) {
                throw new ResourceNotFoundError(_id);
            }
            yield this.deleteLikesAndReplies(commentToDelete);
            const post = yield PostModel.findById(commentToDelete.targetPostId).exec();
            post.comments.delete(_id);
            yield post.save();
            const updatedPost = yield PostModel.findById(commentToDelete.targetPostId).populate(specialPopulatedFieldsPostService).exec();
            return updatedPost.comments;
        });
    }
    deleteLikesAndReplies(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(comment.likes)) } }).exec();
            if (comment.replies.size > 0) {
                for (const replyId of Object.keys(Object.fromEntries(comment.replies))) {
                    const newReply = yield ReplyModel.findById(replyId);
                    yield LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(newReply.likes)) } });
                    yield ReplyModel.findByIdAndDelete(replyId);
                }
            }
        });
    }
}
export const commentsService = new CommentService();
