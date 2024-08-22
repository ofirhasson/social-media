import { convertToMap } from "../Utils/convertToMap";
import { LikeModel } from "./LikeModel";
import { ReplyModel } from "./ReplyModel";
import { UserModel } from "./UserModel";

export class CommentModel {
    _id: string;
    userId: UserModel;
    targetPostId: string;
    text: string;
    imageName: string;
    replies: Map<string, ReplyModel>;
    likes: Map<string, LikeModel>;

    constructor(data: CommentModel) {
        this._id = data._id || '';
        this.userId = data.userId || new UserModel();
        this.targetPostId = data.targetPostId || '';
        this.text = data.text || '';
        this.imageName = data.imageName || '';
        this.replies = convertToMap(data.replies, ReplyModel) || new Map();
        this.likes = convertToMap(data.likes, LikeModel) || new Map();
    }
}
