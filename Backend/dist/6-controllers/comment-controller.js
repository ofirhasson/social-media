var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { CommentModel } from "../3-models/comment-model";
import { ImageType, StatusCode } from "../3-models/enums";
import { commentsService } from "../5-services/comment-service";
import { imagesHandler } from "../2-utils/imagesHandler";
class CommentController {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post("/comment", this.addComment);
        this.router.put("/comment/:_id([a-f0-9A-F]{24})", this.updateComment);
        this.router.delete("/comment/:_id([a-f0-9A-F]{24})", this.deleteComment);
    }
    addComment(request, response, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = (_a = request === null || request === void 0 ? void 0 : request.files) === null || _a === void 0 ? void 0 : _a.image;
                if (image) {
                    const imageName = yield imagesHandler.addImage(image);
                    request.body.imageName = imageName;
                }
                const comment = new CommentModel(request.body);
                const commentsArr = yield commentsService.addComment(comment);
                response.status(StatusCode.Created).json(commentsArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateComment(request, response, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                request.body._id = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a._id;
                const image = (_b = request === null || request === void 0 ? void 0 : request.files) === null || _b === void 0 ? void 0 : _b.image;
                if (image) {
                    const imageName = yield imagesHandler.updateImage(CommentModel, request.body._id, image, ImageType.ImageName);
                    request.body.imageName = imageName;
                }
                const comment = new CommentModel(request.body);
                const updatedCommentsArr = yield commentsService.updateComment(comment);
                response.json(updatedCommentsArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteComment(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = request.params._id;
                const commentsArr = yield commentsService.deleteComment(_id);
                response.status(StatusCode.OK).json(commentsArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
const commentController = new CommentController();
export const commentRouter = commentController.router;
