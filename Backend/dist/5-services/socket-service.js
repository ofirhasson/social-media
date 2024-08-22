"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
const socket_io_1 = require("socket.io");
const comment_model_1 = require("../3-models/comment-model");
const comment_service_1 = require("./comment-service");
class SocketService {
    handleSocketMessages(httpServer) {
        const options = { cors: { origin: "*" } };
        this.socketServer = new socket_io_1.Server(httpServer, options);
        this.socketServer.sockets.on("connection", (socket) => {
            console.log("Client has been connected");
            socket.on("addComment", (data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log("Data received from client:", data);
                    console.log("userId", data === null || data === void 0 ? void 0 : data.userId);
                    console.log("targetPostId", data === null || data === void 0 ? void 0 : data.targetPostId);
                    console.log("text", data === null || data === void 0 ? void 0 : data.text);
                    const { text, targetPostId, userId, imageName, likes, replies } = data;
                    if (!text || !targetPostId || !userId) {
                        throw new Error("Missing required fields");
                    }
                    const comment = new comment_model_1.CommentModel(data);
                    const newComment = yield comment_service_1.commentsService.addComment(comment);
                    this.emitEvent("commentAdded", newComment);
                }
                catch (error) {
                    console.error("Error adding comment:", error);
                    socket.emit("error", error.message);
                }
            }));
            socket.on("updateComment", (data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const comment = new comment_model_1.CommentModel(data);
                    const updatedComment = yield comment_service_1.commentsService.updateComment(comment);
                    this.emitEvent("commentUpdated", updatedComment);
                }
                catch (error) {
                    console.error("Error updating comment:", error);
                    socket.emit("error", error.message);
                }
            }));
            socket.on("deleteComment", (_id) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield comment_service_1.commentsService.deleteComment(_id);
                    this.emitEvent("commentDeleted", _id);
                }
                catch (error) {
                    console.error("Error deleting comment:", error);
                    socket.emit("error", error.message);
                }
            }));
            socket.on("disconnect", () => {
                console.log("Client has been disconnected");
            });
        });
    }
    emitEvent(event, data) {
        if (this.socketServer) {
            this.socketServer.emit(event, data);
        }
    }
}
exports.socketService = new SocketService();
