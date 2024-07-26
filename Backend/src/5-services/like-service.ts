import { ResourceNotFoundError } from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { LikeTarget } from "../3-models/enums";
import { ILikeModel, LikeModel } from "../3-models/like-model";
import { PostModel } from "../3-models/post-model";
import { ReplyModel } from "../3-models/reply-model";
import { UserModel } from "../3-models/user-model";

class LikeService {
  public async addLike(like: ILikeModel): Promise<void> {
    // Check if the target exists
    let targetExists: boolean;

    switch (like.targetType) {
      case LikeTarget.Post:
        targetExists =
          (await PostModel.exists({ _id: like.targetId })) !== null;

        break;
      case LikeTarget.Comment:
        targetExists =
          (await CommentModel.exists({ _id: like.targetId })) !== null;
        break;
      case LikeTarget.Reply:
        targetExists =
          (await ReplyModel.exists({ _id: like.targetId })) !== null;
        break;
      // Add checks for profileImage and coverImage if needed
      default:
        throw new Error("Invalid target type");
    }

    if (!targetExists) {
      throw new ResourceNotFoundError(like.targetId.toString());
    }

    // Check if the user already liked this target
    const existingLike = await LikeModel.findById(like._id);

    if (existingLike) {
      throw new Error("You have already liked this target");
    }

    // Add the like

    await like.save();

    if (like.targetType === LikeTarget.Post) {
      await PostModel.findByIdAndUpdate(like.targetId, {
        $push: { likes: like._id },
      });
      await UserModel.findByIdAndUpdate(like.userId, {
        $push: { likedPosts: like.targetId },
      });
    }
    if (like.targetType === LikeTarget.Comment) {
      await CommentModel.findByIdAndUpdate(like.targetId, {
        $push: { likes: like._id },
      });
    }

    if (like.targetType === LikeTarget.Reply) {
      await ReplyModel.findByIdAndUpdate(like.targetId, {
        $push: { likes: like._id },
      });
    }
  }

  public async removeLike(like: ILikeModel): Promise<void> {
    // Check if the like exists
    const existingLike = await LikeModel.findById(like._id);

    if (!existingLike) {
      throw new ResourceNotFoundError("Like not found");
    }

    // Remove the like
    await LikeModel.findByIdAndDelete(like._id);

    // Remove the like reference from the target
    if (like.targetType === LikeTarget.Post) {
      await PostModel.findByIdAndUpdate(like.targetId, {
        $pull: { likes: like._id },
      });
      await UserModel.findByIdAndUpdate(like.userId, {
        $pull: { likedPosts: like.targetId },
      });
    }
    if (like.targetType === LikeTarget.Comment) {
      await CommentModel.findByIdAndUpdate(like.targetId, {
        $pull: { likes: like._id },
      });
    }

    if (like.targetType === LikeTarget.Reply) {
      await ReplyModel.findByIdAndUpdate(like.targetId, {
        $pull: { likes: like._id },
      });
    }
  }
}

export const likeService = new LikeService();
