var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { specialPopulatedFieldsCommentService, specialPopulatedFieldsPostService, specialPopulatedFieldsReplyService } from "../2-utils/populatedPath";
import { ResourceNotFoundError } from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { LikeTarget } from "../3-models/enums";
import { LikeModel } from "../3-models/like-model";
import { PostModel } from "../3-models/post-model";
import { ReplyModel } from "../3-models/reply-model";
import { UserModel } from "../3-models/user-model";
class LikeService {
    addLike(like) {
        return __awaiter(this, void 0, void 0, function* () {
            let targetExists;
            switch (like.targetType) {
                case LikeTarget.Post:
                    targetExists =
                        (yield PostModel.exists({ _id: like.targetId })) !== null;
                    break;
                case LikeTarget.Comment:
                    targetExists =
                        (yield CommentModel.exists({ _id: like.targetId })) !== null;
                    break;
                case LikeTarget.Reply:
                    targetExists =
                        (yield ReplyModel.exists({ _id: like.targetId })) !== null;
                    break;
                default:
                    throw new Error("Invalid target type");
            }
            if (!targetExists) {
                throw new ResourceNotFoundError(like.targetId.toString());
            }
            const existingLike = yield LikeModel.findOne({ userId: like.userId, targetId: like.targetId, targetType: like.targetType });
            if (existingLike) {
                throw new Error("You have already liked this target");
            }
            const addedLike = yield like.save();
            let likesDictionary;
            if (like.targetType === LikeTarget.Post) {
                const post = yield PostModel.findById(like.targetId);
                post.likes.set(like.userId.toString(), addedLike);
                yield post.save();
                const user = yield UserModel.findById(like.userId);
                user.likedPosts.set(like.userId.toString(), post);
                yield user.save();
                likesDictionary = (yield PostModel.findById(like.targetId).populate(specialPopulatedFieldsPostService)).likes;
            }
            if (like.targetType === LikeTarget.Comment) {
                const comment = yield CommentModel.findById(like.targetId);
                comment.likes.set(like.userId.toString(), addedLike);
                yield comment.save();
                likesDictionary = (yield CommentModel.findById(like.targetId).populate(specialPopulatedFieldsCommentService)).likes;
            }
            if (like.targetType === LikeTarget.Reply) {
                const reply = yield ReplyModel.findById(like.targetId);
                reply.likes.set(like.userId.toString(), addedLike);
                yield reply.save();
                likesDictionary = (yield ReplyModel.findById(like.targetId).populate(specialPopulatedFieldsReplyService)).likes;
            }
            return likesDictionary;
        });
    }
    removeLike(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLike = yield LikeModel.findById(_id);
            if (!existingLike) {
                throw new ResourceNotFoundError("Like not found");
            }
            if (![LikeTarget.Post, LikeTarget.Comment, LikeTarget.Reply].includes(existingLike.targetType)) {
                throw new Error("Invalid target type");
            }
            yield LikeModel.findByIdAndDelete(existingLike._id);
            let likesDictionary;
            if (existingLike.targetType === LikeTarget.Post) {
                const post = yield PostModel.findById(existingLike.targetId);
                post.likes.delete(existingLike.userId.toString());
                yield post.save();
                const user = yield UserModel.findById(existingLike.userId);
                user.likedPosts.delete(existingLike.targetId.toString());
                yield user.save();
                likesDictionary = (yield PostModel.findById(existingLike.targetId).populate(specialPopulatedFieldsPostService)).likes;
            }
            if (existingLike.targetType === LikeTarget.Comment) {
                const comment = yield CommentModel.findById(existingLike.targetId);
                comment.likes.delete(existingLike.userId.toString());
                yield comment.save();
                likesDictionary = (yield CommentModel.findById(existingLike.targetId).populate(specialPopulatedFieldsCommentService)).likes;
            }
            if (existingLike.targetType === LikeTarget.Reply) {
                const reply = yield ReplyModel.findById(existingLike.targetId);
                reply.likes.delete(existingLike.userId.toString());
                yield reply.save();
                likesDictionary = (yield ReplyModel.findById(existingLike.targetId).populate(specialPopulatedFieldsReplyService)).likes;
            }
            return likesDictionary || new Map();
        });
    }
}
export const likeService = new LikeService();
