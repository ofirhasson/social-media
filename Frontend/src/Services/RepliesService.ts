import axios from "axios";
import { LikeModel } from "../Models/LikeModel";
import { ReplyModel } from "../Models/ReplyModel";
import { appConfig } from "../Utils/AppConfig";
import { genericFormData } from "../Utils/GenericFormData";
import { convertToMap } from "../Utils/convertToMap";

class RepliesService {
    public async addReply(reply: ReplyModel): Promise<Map<string, ReplyModel>> {
        const data = genericFormData.createFormData(reply);
        const response = await axios.post<Record<string, any>>(appConfig.repliesUrl, data);
        const repliesMap = new Map<string, ReplyModel>(
            Object.entries(response.data).map(([key, value]) => [
                key,
                this.convertToReplyModel(value)
            ])
        );

        return repliesMap;
    }

    public async updateReply(reply: ReplyModel): Promise<Map<string, ReplyModel>> {
        const data = genericFormData.createFormData(reply);
        const response = await axios.put<Record<string, any>>(appConfig.repliesUrl + reply._id, data);
        const repliesMap = new Map<string, ReplyModel>(
            Object.entries(response.data).map(([key, value]) => [
                key,
                this.convertToReplyModel(value)
            ])
        );
        return repliesMap;
    }

    public async deleteReply(reply: ReplyModel): Promise<Map<string, ReplyModel>> {
        const response = await axios.delete<Record<string, any>>(appConfig.repliesUrl + reply._id);
        const repliesMap = new Map<string, ReplyModel>(
            Object.entries(response.data).map(([key, value]) => [
                key,
                this.convertToReplyModel(value)
            ])
        );
        return repliesMap;
    }

    // Helper method to convert plain object to ReplyModel and handle Map properties
    private convertToReplyModel(data: any): ReplyModel {

        data.userId.photos = {
            profileImage: data.userId.profileImage ? appConfig.postImageUrl + data.userId.profileImage : "",
            coverImage: data.userId.coverImage ? appConfig.postImageUrl + data.userId.coverImage : ""
        }

        return {
            _id: data._id,
            userId: data.userId, // Assuming UserModel has a constructor to handle this
            commentId: data.commentId,
            text: data.text,
            imageName: data.imageName,
            likes: convertToMap(data.likes, LikeModel),
        } as ReplyModel;
    }

}

export const repliesService = new RepliesService();
