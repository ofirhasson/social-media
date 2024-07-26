import { UploadedFile } from "express-fileupload";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../3-models/client-errors";
import { CommentModel, ICommentModel } from "../3-models/comment-model";
import { LikeModel } from "../3-models/like-model";
import { PostModel } from "../3-models/post-model";
import { ReplyModel } from "../3-models/reply-model";
import { socketService } from "./socket-service";

type Comment = {
  comment: ICommentModel;
  image: UploadedFile;
};

class CommentService {
  private specialPopulatedFields = [
    {
      path: "replies",
      populate: {
        path: "userId",
        select:
          "userDetails.firstName userDetails.lastName profileImage coverImage",
      },
    },

    // {
    //   path: "comments",
    //   populate: {
    //     path: "userId",
    //     select:
    //       "userDetails.firstName userDetails.lastName profileImage coverImage",
    //   },
    // },
  ];

  private async getOneComment(_id: string): Promise<ICommentModel> {
    const comment = await CommentModel.findById(_id)
      //   .populate(this.specialPopulatedFields)
      .exec();
    return comment;
  }

  public async addComment(comment: ICommentModel): Promise<ICommentModel> {
    const errors = comment.validateSync();
    if (errors) {
      throw new ValidationError(errors.message);
    }

    const newComment = await comment.save();

    await PostModel.findByIdAndUpdate(comment.targetPostId, {
      $push: { comments: newComment._id },
    }).exec();

    const populatedComment = await this.getOneComment(comment._id);
    socketService.emitEvent("commentAdded", populatedComment);

    return populatedComment;
  }

  public async updateComment(comment: ICommentModel): Promise<ICommentModel> {
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
      console.log({ post: post });

      throw new ResourceNotFoundError(post._id);
    }
    const commentIndex = post.comments.findIndex(
      (commentId) => commentId.toString() === comment._id.toString()
    );
    if (commentIndex === -1) {
      console.log({ commentIndex: commentIndex });

      throw new ResourceNotFoundError(comment._id);
    }

    post.comments[commentIndex] = updatedComment._id;

    await post.save();

    const populatedComment = await this.getOneComment(updatedComment._id);
    socketService.emitEvent("commentUpdated", populatedComment);

    return populatedComment;
  }

  public async deleteComment(_id: string): Promise<void> {
    this.deleteLikesAndReplies(_id);
    const commentToDelete = await CommentModel.findByIdAndDelete(_id).exec();
    if (!commentToDelete) {
      throw new ResourceNotFoundError(_id);
    }

    await PostModel.updateOne(
      { _id: commentToDelete.targetPostId },
      { $pull: { comments: _id } }
    );

    socketService.emitEvent('commentDeleted', _id);
  }

  public async deleteLikesAndReplies(commentId: string): Promise<void> {
    const comment = await CommentModel.findById(commentId).exec();
    if (!comment) {
      throw new ResourceNotFoundError(commentId);
    }
    await LikeModel.deleteMany({ _id: { $in: comment.likes } }).exec();

    if (comment.replies.length > 0) {
      for (const reply of comment.replies) {
        const newReply = await ReplyModel.findById(reply);
        await LikeModel.deleteMany({ _id: { $in: newReply.likes } });
        await ReplyModel.findByIdAndDelete(reply);
      }
    }
  }
}

export const commentsService = new CommentService();
