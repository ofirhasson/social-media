import axios from "axios";
import { CommentModel } from "../Models/CommentModel";
import { appConfig } from "../Utils/AppConfig";
import { genericFormData } from "../Utils/GenericFormData";
import { socketService } from "./SocketService";
import { LikeModel } from "../Models/LikeModel";
import { ReplyModel } from "../Models/ReplyModel";
import { UserModel } from "../Models/UserModel";
import { convertToMap } from "../Utils/convertToMap";

class CommentsService {
    // private ensureSocketConnection() {
    //     if (!socketService.socket) {
    //       socketService.connect();
    //     }
    //   }

    public async addComment(comment: CommentModel): Promise<Map<string, CommentModel>> {
        // this.ensureSocketConnection();
        const data = genericFormData.createFormData(comment);
        // console.log("Data being sent to server:", comment);

        // socketService.socket?.emit("addComment", comment);

        const response = await axios.post<Record<string, CommentModel>>(appConfig.commentUrl, data);

        const commentsMap = new Map<string, CommentModel>(
            Object.entries(response.data).map(([key, value]) => [
                key,
                this.convertToCommentModel(value)
            ])
        );

        return commentsMap;
        // appStore.dispatch(postActionCreators.addComment(response.data))
    }

    public async updateComment(comment: CommentModel): Promise<Map<string, CommentModel>> {
        // this.ensureSocketConnection();
        const data = genericFormData.createFormData(comment);
        // socketService.socket?.emit("updateComment", data);
        const response = await axios.put<Record<string, CommentModel>>(appConfig.commentUrl + comment._id, data);
        const commentsMap = new Map<string, CommentModel>(
            Object.entries(response.data).map(([key, value]) => [
                key,
                this.convertToCommentModel(value)
            ])
        );
        return commentsMap;
        // appStore.dispatch(postActionCreators.updateComment(response.data))
    }

    public async deleteComment(comment: CommentModel): Promise<Map<string, CommentModel>> {
        // this.ensureSocketConnection();
        const response = await axios.delete<Record<string, CommentModel>>(appConfig.commentUrl + comment._id);
        // console.log(response.data);
        const commentsMap = new Map<string, CommentModel>(
            Object.entries(response.data).map(([key, value]) => [
                key,
                this.convertToCommentModel(value)
            ])
        );

        return commentsMap;
        // appStore.dispatch(postActionCreators.deleteComment(comment))
        // socketService.socket?.emit("deleteComment", _id);
    }

    // Helper method to convert plain object to CommentModel and handle Map properties
    private convertToCommentModel(data: any): CommentModel {

        const likes = convertToMap(data.likes, LikeModel) || new Map();
        const replies = convertToMap(data.replies, ReplyModel) || new Map();
        // console.log(data.userId.profileImage);

        data.userId.photos = {
            profileImage: data.userId.profileImage ? appConfig.postImageUrl + data.userId.profileImage : "",
            coverImage: data.userId.coverImage ? appConfig.postImageUrl + data.userId.coverImage : ""
        }

        return {
            _id: data._id,
            userId: data.userId, // Assuming UserModel has a constructor to handle this
            targetPostId: data.targetPostId,
            text: data.text,
            imageName: data.imageName,
            replies: replies,
            likes: likes,
        } as CommentModel;
    }
}

export const commentsService = new CommentsService();
