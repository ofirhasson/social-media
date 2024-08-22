import { imagesHandler } from "../2-utils/imagesHandler";
import { specialPopulatedFieldsPostService } from "../2-utils/populatedPath";
import { ResourceNotFoundError, ValidationError, } from "../3-models/client-errors";
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

    public async getAllPostsByTargetUser(userId: string, targetUserId?: string): Promise<Map<string, IPostModel>> {
        const user = await UserModel.findById(userId).exec();

        if (!user) {
            throw new ResourceNotFoundError(userId);
        }

        const friends = Object.fromEntries(user.friends);

        let query: any = {};

        if (!targetUserId) {
            query = {
                $or: [
                    { privacyOptions: PrivacyOptions.Public },
                    { privacyOptions: PrivacyOptions.Friends, userId: { $in: Object.keys(friends) } },
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
                        userId: { $in: Object.keys(friends) },
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
                    { privacyOptions: PrivacyOptions.Friends, userId: { $in: Object.keys(friends) } },
                ],
            };
        }

        const posts = await PostModel.find(query)
            .populate(specialPopulatedFieldsPostService)
            .exec();

        // Convert the array of posts into a dictionary
        const postDictionary = new Map();
        posts.forEach((post) => {
            postDictionary[post._id.toString()] = post;
            // postDictionary.set(post._id.toString(), post);
        });

        return postDictionary;
    }

    public async getPostById(postId: string, userId: string): Promise<IPostModel> {
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

        const user = await UserModel.findById(post.userId).exec();
        user.posts.set(newPost._id.toString(), newPost);
        await user.save();

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

        post.comments = oldPost.comments;
        post.likes = oldPost.likes;

        if (post.imageNames.length === 0) {
            post.imageNames = oldPost?.imageNames;
        }
        else {
            await UserModel.findByIdAndUpdate(post.userId, {
                $push: { postsAlbum: { $each: post.imageNames } },
            }).exec();
        }

        const updatedPost = await PostModel.findByIdAndUpdate(post._id, post, {
            new: true,
        }).exec();

        if (!updatedPost) {
            throw new ResourceNotFoundError(post._id);
        }

        const user = await UserModel.findById(post.userId).exec();

        user.posts.set(post._id.toString(), post);

        await user.save();

        return this.getPostById(updatedPost._id, post.userId.toString());
    }

    public async deletePost(postId: string): Promise<void> {
        const postToDelete = await PostModel.findById(postId).exec();
        if (!postToDelete) {
            throw new ResourceNotFoundError(postId);
        }

        const comments = await CommentModel.find({
            _id: { $in: Object.keys(Object.fromEntries(postToDelete.comments)) },
        }).exec();

        for (const comment of comments) {
            await commentsService.deleteComment(comment._id);
        }

        await LikeModel.deleteMany({ _id: { $in: Object.keys(Object.fromEntries(postToDelete.likes)) } }).exec();
        // Remove post images from all user albums
        await UserModel.updateOne(
            { _id: postToDelete.userId, [`posts.${postId}`]: postId },
            { $unset: { [`posts.${postId}`]: true } }
        ).exec();

        // Remove post images from the specific user's postsAlbum
        await UserModel.updateOne(
            { _id: postToDelete.userId },
            { $pullAll: { postsAlbum: postToDelete.imageNames } }
        ).exec();

        await UserModel.updateMany(
            { [`likedPosts.${postId}`]: postId },
            { $unset: { [`likedPosts.${postId}`]: true } }
        ).exec();

        // Optionally, delete images from storage if needed

        await imagesHandler.deleteImagesArr(postToDelete.imageNames);

        await PostModel.findByIdAndDelete(postId).exec();
    }
}

export const postService = new PostService();
