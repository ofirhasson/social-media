import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { CommentModel, ICommentModel } from "../3-models/comment-model";
import { commentsService } from "./comment-service";

class SocketService {
  private socketServer: SocketServer;

  public handleSocketMessages(httpServer: HttpServer): void {
    const options = { cors: { origin: "*" } };

    this.socketServer = new SocketServer(httpServer, options);

    this.socketServer.sockets.on("connection", (socket: Socket) => {
      console.log("Client has been connected");

      socket.on("addComment", async (data:ICommentModel) => {
        try {
          console.log("Data received from client:", data);

          console.log("userId",data?.userId);
          console.log("targetPostId",data?.targetPostId);
          console.log("text",data?.text);
          

          const { text, targetPostId, userId,imageName,likes,replies } = data;
          if (!text || !targetPostId || !userId) {
            throw new Error("Missing required fields");
          }

          const comment = new CommentModel(data);
          const newComment = await commentsService.addComment(comment);
          this.emitEvent("commentAdded", newComment);
        } catch (error) {
          console.error("Error adding comment:", error);
          socket.emit("error", error.message);
        }
      });

      socket.on("updateComment", async (data) => {
        try {
          const comment = new CommentModel(data);
          const updatedComment = await commentsService.updateComment(comment);
          this.emitEvent("commentUpdated", updatedComment);
        } catch (error) {
          console.error("Error updating comment:", error);
          socket.emit("error", error.message);
        }
      });

      socket.on("deleteComment", async (_id) => {
        try {
          await commentsService.deleteComment(_id);
          this.emitEvent("commentDeleted", _id);
        } catch (error) {
          console.error("Error deleting comment:", error);
          socket.emit("error", error.message);
        }
      });

      socket.on("disconnect", () => {
        console.log("Client has been disconnected");
      });
    });
  }

  public emitEvent(event: string, data: any): void {
    if (this.socketServer) {
      this.socketServer.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
