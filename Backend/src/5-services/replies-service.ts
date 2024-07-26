import {
  ResourceNotFoundError,
  ValidationError,
} from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { LikeModel } from "../3-models/like-model";
import { PostModel } from "../3-models/post-model";
import { IReplyModel, ReplyModel } from "../3-models/reply-model";

class RepliesService {
  public async addReply(reply: IReplyModel): Promise<void> {
    const errors = reply.validateSync();
    if (errors) {
      throw new ValidationError(errors.message);
    }
    await reply.save();

    await CommentModel.findByIdAndUpdate(reply.commentId, {
      $push: { replies: reply },
    });
  }

  public async updateReply(reply: IReplyModel): Promise<void> {
    const errors = reply.validateSync();
    if (errors) {
      throw new ValidationError(errors.message);
    }

    const oldReply = await ReplyModel.findById(reply._id).exec();
    if (!oldReply) {
      throw new ResourceNotFoundError(reply._id);
    }
    if (oldReply.userId.toString() !== reply.userId.toString()) {
      throw new Error("Access denied");
    }

    await ReplyModel.findByIdAndUpdate(oldReply._id, reply, {
      new: true,
    }).exec();

    const comment = await CommentModel.findById(reply.commentId).exec();

    const replies = comment.replies;

    const replyIndex = replies.findIndex(
      (r) => r._id.toString() === reply._id.toString()
    );

    replies[replyIndex] = reply._id;

    await comment.save();
  }

  public async deleteReply(_id: string): Promise<void> {
    const replyToDelete = await ReplyModel.findById(_id).exec();
    if (!replyToDelete) {
      throw new ResourceNotFoundError(_id);
    }

    await LikeModel.deleteMany({ _id: { $in: replyToDelete.likes } });

    await ReplyModel.findByIdAndDelete(_id).exec();

    await CommentModel.updateOne(
      { _id: replyToDelete.commentId },
      { $pull: { replies: _id } }
    );
  }
}

export const repliesService = new RepliesService();
