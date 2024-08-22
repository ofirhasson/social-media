import { specialPopulatedFieldsCommentService, specialPopulatedFieldsPostService, specialPopulatedFieldsReplyService } from "../2-utils/populatedPath";
import { ResourceNotFoundError } from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { LikeTarget } from "../3-models/enums";
import { ILikeModel, LikeModel } from "../3-models/like-model";
import { PostModel } from "../3-models/post-model";
import { ReplyModel } from "../3-models/reply-model";
import { UserModel } from "../3-models/user-model";

class LikeService {

    public async addLike(like: ILikeModel): Promise<Map<string, ILikeModel>> {
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
        const existingLike = await LikeModel.findOne({ userId: like.userId, targetId: like.targetId, targetType: like.targetType });

        if (existingLike) {
            throw new Error("You have already liked this target");
        }

        // Add the like

        const addedLike = await like.save();

        let likesDictionary: Map<string, ILikeModel>;

        if (like.targetType === LikeTarget.Post) {
            const post = await PostModel.findById(like.targetId);
            post.likes.set(like.userId.toString(), addedLike);
            await post.save();

            const user = await UserModel.findById(like.userId);
            user.likedPosts.set(like.userId.toString(), post);
            await user.save();

            likesDictionary = (await PostModel.findById(like.targetId).populate(specialPopulatedFieldsPostService)).likes;
        }
        if (like.targetType === LikeTarget.Comment) {
            const comment = await CommentModel.findById(like.targetId);
            comment.likes.set(like.userId.toString(), addedLike);
            await comment.save();
            likesDictionary = (await CommentModel.findById(like.targetId).populate(specialPopulatedFieldsCommentService)).likes;
        }

        if (like.targetType === LikeTarget.Reply) {
            const reply = await ReplyModel.findById(like.targetId);
            reply.likes.set(like.userId.toString(), addedLike);
            await reply.save();
            likesDictionary = (await ReplyModel.findById(like.targetId).populate(specialPopulatedFieldsReplyService)).likes;
        }

        return likesDictionary;
    }

    public async removeLike(_id: string): Promise<Map<string, ILikeModel>> {
        // Check if the like exists

        const existingLike = await LikeModel.findById(_id);

        if (!existingLike) {
            throw new ResourceNotFoundError("Like not found");
        }

        if (
            ![LikeTarget.Post, LikeTarget.Comment, LikeTarget.Reply].includes(
                existingLike.targetType
            )
        ) {
            throw new Error("Invalid target type");
        }

        // Remove the like
        await LikeModel.findByIdAndDelete(existingLike._id);

        let likesDictionary: Map<string, ILikeModel>;

        // Remove the like reference from the target
        if (existingLike.targetType === LikeTarget.Post) {
            const post = await PostModel.findById(existingLike.targetId);
            post.likes.delete(existingLike.userId.toString());
            await post.save();

            const user = await UserModel.findById(existingLike.userId);
            user.likedPosts.delete(existingLike.targetId.toString());
            await user.save();
            likesDictionary = (await PostModel.findById(existingLike.targetId).populate(specialPopulatedFieldsPostService)).likes;
        }
        if (existingLike.targetType === LikeTarget.Comment) {
            const comment = await CommentModel.findById(existingLike.targetId);
            comment.likes.delete(existingLike.userId.toString())
            await comment.save();
            likesDictionary = (await CommentModel.findById(existingLike.targetId).populate(specialPopulatedFieldsCommentService)).likes;
        }

        if (existingLike.targetType === LikeTarget.Reply) {
            const reply = await ReplyModel.findById(existingLike.targetId);
            reply.likes.delete(existingLike.userId.toString())
            await reply.save();
            likesDictionary = (await ReplyModel.findById(existingLike.targetId).populate(specialPopulatedFieldsReplyService)).likes;
        }

        return likesDictionary || new Map();

    }

}

export const likeService = new LikeService();
