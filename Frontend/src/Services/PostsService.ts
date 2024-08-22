import axios from "axios";
import { PostModel } from "../Models/PostModel";
import { UserModel } from "../Models/UserModel";
// import { postActionCreators } from "../Redux/Slices/PostsSlice";
import { appStore } from "../Redux/Store";
import { appConfig } from "../Utils/AppConfig";
import { genericFormData } from "../Utils/GenericFormData";
import { parse } from 'flatted';
import { LikeModel } from "../Models/LikeModel";
import { CommentModel } from "../Models/CommentModel";
import { convertToMap } from "../Utils/convertToMap";

type PostQuery = {
    userId?: string;
    targetUserId?: string;
    postId?: string;
};

class PostsService {
    public async getAllPostsByTargetUser({ userId, targetUserId, }: PostQuery): Promise<Map<string, PostModel>> {
        const params: PostQuery = {
            userId,
            targetUserId,
        };
        const response = await axios.get<Record<string, PostModel>>(
            `${appConfig.postsUrl}target`,
            { params }
        );
        console.log(response.data);
        
        const postsMap = new Map<string, PostModel>(
            Object.entries(response.data).map(([key, value]) =>
                [
                    key,
                    this.convertToPostModel(value)
                ])
        );
        // const postsMap = convertToMap(parse(response.data)) as Map<string, PostModel>;

        return postsMap;

    }

    // Helper method to convert plain object to PostModel and handle Map properties
    private convertToPostModel(data: any): PostModel {
        // Convert any nested Maps
        const likes = convertToMap(data.likes, LikeModel);
        const comments = convertToMap(data.comments, CommentModel);

        // Create and return the PostModel instance
        return {
            _id: data._id,
            userId: data.userId,
            targetUserId: data.targetUserId,
            privacyOptions: data.privacyOptions,
            content: data.content,
            imageNames: data.imageNames,
            photosUrl: data.photosUrl,
            images: data.images, // Handle file input accordingly
            likes: likes,
            comments: comments,
            created: data.created,
        } as PostModel;
    }

    // public async getPostById({ postId, userId }: PostQuery): Promise<PostModel> {
    //     const posts = appStore.getState().posts;
    //     const post = posts.find((post) => post?._id === postId);
    //     if (post) {
    //         return post;
    //     }

    //     const params: PostQuery = {
    //         userId,
    //     };

    //     const response = await axios.get<PostModel>(
    //         `${appConfig.postsUrl}/${postId}`,
    //         { params }
    //     );
    //     return response.data;
    // }

    public async createPost(post: PostModel): Promise<void> {
        const data = genericFormData.createFormData(post);
        await axios.post<PostModel>(appConfig.postsUrl, data);
        // appStore.dispatch(postActionCreators.createPost(post));
    }

    public async updatePost(post: PostModel): Promise<void> {
        const data = genericFormData.createFormData(post);
        await axios.put<UserModel>(appConfig.postsUrl + post._id, data);
        // appStore.dispatch(postActionCreators.updatePost(post));
    }

    public async deletePost(_id: string): Promise<void> {
        await axios.delete<PostModel>(appConfig.postsUrl + _id);
        // appStore.dispatch(postActionCreators.deletePost(_id));
    }
}

export const postsService = new PostsService();
