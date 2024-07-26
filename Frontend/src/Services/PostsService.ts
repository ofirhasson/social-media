import axios from "axios";
import { PostModel } from "../Models/PostModel";
import { UserModel } from "../Models/UserModel";
import { postActionCreators } from "../Redux/PostSlice";
import { appStore } from "../Redux/Store";
import { appConfig } from "../Utils/AppConfig";
import { genericFormData } from "../Utils/GenericFormData";

type PostQuery = {
  userId?: string;
  targetUserId?: string;
  postId?: string;
};

class PostsService {
  public async getAllPostsByTargetUser({
    userId,
    targetUserId,
  }: PostQuery): Promise<PostModel[]> {
    const params: PostQuery = {
      userId,
      targetUserId,
    };
    const response = await axios.get<PostModel[]>(
      `${appConfig.postsUrl}target`,
      { params }
    );
    appStore.dispatch(postActionCreators.initPosts(response.data));

    return response.data;
  }

  public async getPostById({ postId, userId }: PostQuery): Promise<PostModel> {
    const posts: PostModel[] = appStore.getState().posts;
    const post = posts.find((post) => post._id === postId);
    if (post) {
      return post;
    }

    const params: PostQuery = {
      userId,
    };

    const response = await axios.get<PostModel>(
      `${appConfig.postsUrl}/${postId}`,
      { params }
    );
    return response.data;
  }

  public async createPost(post: PostModel): Promise<void> {
    const data = genericFormData.createFormData(post);
    await axios.post<PostModel>(appConfig.postsUrl, data);
    appStore.dispatch(postActionCreators.createPost(post));
  }

  public async updatePost(post: PostModel): Promise<void> {
    const data = genericFormData.createFormData(post);
    await axios.put<UserModel>(appConfig.postsUrl + post._id, data);
    appStore.dispatch(postActionCreators.updatePost(post));
  }

  public async deletePost(_id: string): Promise<void> {
    await axios.delete<PostModel>(appConfig.postsUrl +_id);
    appStore.dispatch(postActionCreators.deletePost(_id));
  }
}

export const postsService = new PostsService();
