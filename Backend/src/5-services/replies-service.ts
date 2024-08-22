import { specialPopulatedFieldsCommentService, specialPopulatedFieldsReplyService } from "../2-utils/populatedPath";
import { ResourceNotFoundError, ValidationError } from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { LikeModel } from "../3-models/like-model";
import { IReplyModel, ReplyModel } from "../3-models/reply-model";

class RepliesService {
    public async getOneReply(_id: string): Promise<IReplyModel> {
        const reply = await ReplyModel.findById(_id)
            .populate(specialPopulatedFieldsReplyService)
            .exec();
        return reply;
    }

    public async addReply(reply: IReplyModel): Promise<Map<string, IReplyModel>> {
        const errors = reply.validateSync();
        if (errors) {
            throw new ValidationError(errors.message);
        }
        await reply.save();

        const comment = await CommentModel.findByIdAndUpdate(reply.commentId).exec();
        comment.replies.set(reply._id.toString(), reply);
        await comment.save()

        const newComment = await CommentModel.findById(reply.commentId).populate(specialPopulatedFieldsCommentService).exec();
        return newComment.replies;

    }

    public async updateReply(reply: IReplyModel): Promise<Map<string, IReplyModel>> {
        const errors = reply.validateSync();
        if (errors) {
            throw new ValidationError(errors.message);
        }

        const oldReply = await ReplyModel.findById(reply._id).exec();
        console.log({ oldReply: oldReply });
        if (!oldReply) {
            throw new ResourceNotFoundError(reply._id);
        }

        reply.likes = oldReply.likes

        if (oldReply.userId.toString() !== reply.userId.toString()) {
            throw new Error("Access denied");
        }

        await ReplyModel.findByIdAndUpdate(oldReply._id, reply, {
            new: true,
        }).exec();

        const comment = await CommentModel.findById(reply.commentId).exec();

        comment.replies.set(reply._id.toString(), reply);

        await comment.save();

        const newComment = await CommentModel.findById(reply.commentId).populate(specialPopulatedFieldsCommentService).exec();

        return newComment.replies;
    }

    public async deleteReply(_id: string): Promise<Map<string, IReplyModel>> {
        const replyToDelete = await ReplyModel.findById(_id).exec();
        if (!replyToDelete) {
            throw new ResourceNotFoundError(_id);
        }

        await LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(replyToDelete.likes)) } });

        await ReplyModel.findByIdAndDelete(_id).exec();

        const comment = await CommentModel.findById(replyToDelete.commentId);
        comment.replies.delete(_id);
        await comment.save();

        const newComment = await CommentModel.findById(replyToDelete.commentId).populate(specialPopulatedFieldsCommentService).exec();

        return newComment.replies;
    }
}

export const repliesService = new RepliesService();
