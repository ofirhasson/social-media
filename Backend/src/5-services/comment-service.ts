import { specialPopulatedFieldsCommentService, specialPopulatedFieldsPostService } from "../2-utils/populatedPath";
import { ResourceNotFoundError, ValidationError } from "../3-models/client-errors";
import { CommentModel, ICommentModel } from "../3-models/comment-model";
import { LikeModel } from "../3-models/like-model";
import { PostModel } from "../3-models/post-model";
import { ReplyModel } from "../3-models/reply-model";

class CommentService {

    private async getOneComment(_id: string): Promise<ICommentModel> {
        const comment = await CommentModel.findById(_id)
            .populate(specialPopulatedFieldsCommentService)
            .exec();
        return comment;
    }

    public async addComment(comment: ICommentModel): Promise<Map<string,ICommentModel>> {
        const errors = comment.validateSync();
        if (errors) {
            throw new ValidationError(errors.message);
        }

        const newComment = await comment.save();

        const post = await PostModel.findById(comment.targetPostId).exec();

        post.comments.set(newComment._id.toString(), newComment);
        await post.save();

        const newPost = await PostModel.findById(comment.targetPostId).populate(specialPopulatedFieldsPostService).exec();

        // socketService.emitEvent("commentAdded", populatedComment);
        return newPost.comments;
    }

    public async updateComment(comment: ICommentModel): Promise<Map<string,ICommentModel>> {
        const errors = comment.validateSync();
        if (errors) {
            throw new ValidationError(errors.message);
        }

        const oldComment = await CommentModel.findById(comment._id).exec();
        if (!oldComment) {
            throw new ResourceNotFoundError(comment._id);
        }

        comment.replies = oldComment.replies;
        comment.likes = oldComment.likes;

        if (oldComment.userId.toString() !== comment.userId.toString()) {
            throw new Error("Access denied");
        }

        const updatedComment = await CommentModel.findByIdAndUpdate(
            comment._id,
            comment,
            { new: true }
        );

        const post = await PostModel.findById(comment?.targetPostId).exec();

        if (!post) {

            throw new ResourceNotFoundError(post._id);
        }

        if (!post.comments.has(comment._id.toString())) {

            throw new ResourceNotFoundError(comment._id);
        }

        post.comments.set(comment._id.toString(), updatedComment);

        await post.save();

        const newPost = await PostModel.findById(comment?.targetPostId).populate(specialPopulatedFieldsPostService).exec();

        // socketService.emitEvent("commentUpdated", populatedComment);

        return newPost.comments;
    }

    public async deleteComment(_id: string): Promise<Map<string,ICommentModel>> {
        const commentToDelete = await CommentModel.findByIdAndDelete(_id).exec();

        if (!commentToDelete) {
            throw new ResourceNotFoundError(_id);
        }

        await this.deleteLikesAndReplies(commentToDelete);

        const post = await PostModel.findById(commentToDelete.targetPostId).exec();
        post.comments.delete(_id);
        await post.save();

        const updatedPost = await PostModel.findById(commentToDelete.targetPostId).populate(specialPopulatedFieldsPostService).exec();

        return updatedPost.comments;
        // socketService.emitEvent("commentDeleted", _id);
    }

    public async deleteLikesAndReplies(comment: ICommentModel): Promise<void> {

        await LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(comment.likes)) } }).exec();
        if (comment.replies.size > 0) {
            for (const replyId of Object.keys(Object.fromEntries(comment.replies))) {
                const newReply = await ReplyModel.findById(replyId);
                await LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(newReply.likes)) } });
                await ReplyModel.findByIdAndDelete(replyId);
            }
        }
    }
}

export const commentsService = new CommentService();
