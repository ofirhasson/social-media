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
import { ReplyModel } from "../3-models/reply-model";
import { repliesService } from "../5-services/replies-service";
import { ImageType, StatusCode } from "../3-models/enums";
import { imagesHandler } from "../2-utils/imagesHandler";
class RepliesController {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post("/reply", this.addReply);
        this.router.put("/reply/:replyId", this.updateReply);
        this.router.delete("/reply/:replyId", this.deleteReply);
    }
    addReply(request, response, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = (_a = request === null || request === void 0 ? void 0 : request.files) === null || _a === void 0 ? void 0 : _a.image;
                if (image) {
                    imagesHandler.configureFileSaver("1-assets", "replies-images");
                    const imageName = yield imagesHandler.addImage(image);
                    request.body = imageName;
                }
                const reply = new ReplyModel(request.body);
                const repliesArr = yield repliesService.addReply(reply);
                response.status(StatusCode.Created).json(repliesArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateReply(request, response, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                request.body._id = request.params.replyId;
                const image = (_a = request === null || request === void 0 ? void 0 : request.files) === null || _a === void 0 ? void 0 : _a.image;
                if (image) {
                    imagesHandler.configureFileSaver("1-assets", "replies-images");
                    const imageName = yield imagesHandler.updateImage(ReplyModel, request.body.replayId, request.body.imageName, ImageType.ImageName);
                    request.body.imageName = imageName;
                }
                const reply = new ReplyModel(request.body);
                const repliesArr = yield repliesService.updateReply(reply);
                response.status(StatusCode.Created).json(repliesArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteReply(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { replyId } = request.params;
                const repliesArr = yield repliesService.deleteReply(replyId);
                response.status(StatusCode.OK).json(repliesArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
const repliesController = new RepliesController();
export const repliesRouter = repliesController.router;
