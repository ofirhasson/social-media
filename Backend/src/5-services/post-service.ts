import { imagesHandler } from "../2-utils/imagesHandler";
import { specialPopulatedFieldsPostService } from "../2-utils/populatedPath";
import {
    ResourceNotFoundError,
    ValidationError,
} from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { PrivacyOptions } from "../3-models/enums";
import { LikeModel } from "../3-models/like-model";
import { IPostModel, PostModel } from "../3-models/post-model";
import { UserModel } from "../3-models/user-model";
import { commentsService } from "./comment-service";

class PostService {
  public populatedFields(): string[] {
    return ["userId", "comments", "likes"];
  }

  public async getAllPostsByTargetUser(
    userId: string,
    targetUserId?: string
  ): Promise<IPostModel[]> {
    const user = await UserModel.findById(userId).exec();

    if (!user) {
      throw new ResourceNotFoundError(userId);
    }

    const friends = user.friends.map((friend) => friend);

    let query: any = {};

    if (!targetUserId) {
      query = {
        $or: [
          { privacyOptions: PrivacyOptions.Public },
          { privacyOptions: PrivacyOptions.Friends, userId: { $in: friends } },
          { userId: userId }, // This condition ensures all posts by the user (public, friends, private) are included
        ],
      };
    } else if (userId === targetUserId) {
      query = {
        $or: [
          { userId: userId },
          { targetUserId: userId },
          {
            privacyOptions: PrivacyOptions.Friends,
            userId: { $in: friends },
            targetUserId: targetUserId,
          },
        ],
      };
    } else {
      const targetUser = await UserModel.findById(targetUserId).exec();
      if (!targetUser) {
        throw new ResourceNotFoundError(targetUserId);
      }
      query = {
        $or: [
          { userId: userId, targetUserId: targetUserId },
          {
            privacyOptions: PrivacyOptions.Private,
            userId: targetUserId,
            targetUserId: userId,
          },
          { privacyOptions: PrivacyOptions.Public, userId: targetUserId },
          { privacyOptions: PrivacyOptions.Friends, userId: { $in: friends } },
        ],
      };
    }

    const posts = await PostModel.find(query)
      .populate(specialPopulatedFieldsPostService)
      .exec();

    return posts;
  }

  public async getPostById(
    postId: string,
    userId: string
  ): Promise<IPostModel> {
    const post = await PostModel.findById(postId)
      .populate(specialPopulatedFieldsPostService)
      .exec();

    if (!post) {
      throw new ResourceNotFoundError(postId);
    }

    const postUserIdStr = post.userId.toString();
    const userIdStr = userId.toString();

    // Allow the post owner to access their private post
    if (postUserIdStr === userIdStr) {
      return post;
    }

    return post;
  }

  public async createPost(post: IPostModel): Promise<IPostModel> {
    const errors = post.validateSync();
    if (errors) {
      throw new ValidationError(errors.message);
    }

    if (post.imageNames && post.imageNames.length > 0) {
      await UserModel.findByIdAndUpdate(post.userId, {
        $push: { postsAlbum: { $each: post.imageNames } },
      }).exec();
    }

    const newPost = await post.save();

    await UserModel.findByIdAndUpdate(post.userId, {
      $push: { posts: newPost._id },
    }).exec();

    return this.getPostById(newPost?._id, newPost?.userId.toString());
  }

  public async updatePost(post: IPostModel): Promise<IPostModel> {
    const errors = post.validateSync();
    if (errors) {
      throw new ValidationError(errors.message);
    }

    const oldPost = await PostModel.findById(post._id).exec();

    if (!oldPost) {
      throw new ResourceNotFoundError(post._id);
    }

    if (oldPost.userId.toString() !== post.userId.toString()) {
      throw new Error("Access denied");
    }

    const updatedPost = await PostModel.findByIdAndUpdate(post._id, post, {
      new: true,
    }).exec();

    if (!updatedPost) {
      throw new ResourceNotFoundError(post._id);
    }

    const user = await UserModel.findById(post.userId).exec();

    const posts = user.posts;

    const postIndex = posts.findIndex((p) => p._id.toString() === post._id);

    posts[postIndex] = post._id;

    await user.save();

    return this.getPostById(updatedPost._id, post.userId.toString());
  }

  public async deletePost(postId: string): Promise<void> {
    const postToDelete = await PostModel.findByIdAndDelete(postId).exec();
    if (!postToDelete) {
      throw new ResourceNotFoundError(postId);
    }

    const comments = await CommentModel.find({
      _id: { $in: postToDelete.comments },
    }).exec();

    for (const comment of comments) {
      await commentsService.deleteComment(comment._id);
    }

    await LikeModel.deleteMany({ _id: { $in: postToDelete.likes } }).exec();
    // Remove post images from all user albums

    await UserModel.updateMany(
      { posts: postId },
      { $pull: { posts: postId } }
    ).exec();

    // Remove post images from the specific user's postsAlbum
    await UserModel.updateMany(
      { postsAlbum: { $in: postToDelete.imageNames } },
      { $pullAll: { postsAlbum: postToDelete.imageNames } }
    ).exec();

    await UserModel.updateMany(
      { likedPosts: postId },
      { $pull: { likedPosts: postId } }
    ).exec();

    // Optionally, delete images from storage if needed

    await imagesHandler.deleteImagesArr(postToDelete.imageNames);
  }
}

export const postService = new PostService();
