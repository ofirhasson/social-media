import axios from "axios";
import { CommentModel } from "../Models/CommentModel";
import { appConfig } from "../Utils/AppConfig";
import { genericFormData } from "../Utils/GenericFormData";
import { socketService } from "./SocketService";
import { appStore } from "../Redux/Store";
import { commentActionCreators } from "../Redux/CommentsSlice";
import { postActionCreators } from "../Redux/PostSlice";
import { postsService } from "./PostsService";

class CommentsService {
  // private ensureSocketConnection() {
  //     if (!socketService.socket) {
  //       socketService.connect();
  //     }
  //   }

  public async addComment(comment: CommentModel): Promise<void> {
    // this.ensureSocketConnection();
    const data = genericFormData.createFormData(comment);
    console.log("Data being sent to server:", comment);

    // socketService.socket?.emit("addComment", comment);

    await axios.post<CommentModel>(appConfig.commentUrl, data);
  }

  public async updateComment(comment: CommentModel): Promise<void> {
    // this.ensureSocketConnection();
    const data = genericFormData.createFormData(comment);
    socketService.socket?.emit("updateComment", data);
    // await axios.put<CommentModel>(appConfig.commentUrl + comment._id, data);
  }

  public async deleteComment(_id: string): Promise<void> {
    // this.ensureSocketConnection();
    await axios.delete<CommentModel>(appConfig.commentUrl + _id);
    socketService.socket?.emit("deleteComment", _id);
  }
}

export const commentsService = new CommentsService();
