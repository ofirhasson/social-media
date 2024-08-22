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
import { LikeTarget, StatusCode } from "../3-models/enums";
import { likeService } from "../5-services/like-service";
import { LikeModel } from "../3-models/like-model";
class LikeController {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post("/like/add-like", this.addLike);
        this.router.post("/like/delete-like/:_id([a-f0-9A-F]{24})", this.deleteLike);
    }
    addLike(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const like = new LikeModel(request.body);
                if (![LikeTarget.Post, LikeTarget.Comment, LikeTarget.Reply].includes(like.targetType)) {
                    throw new Error("Invalid target type");
                }
                const likesArr = yield likeService.addLike(like);
                response.status(StatusCode.Created).json(likesArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteLike(request, response, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const likesArr = yield likeService.removeLike((_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a._id);
                response.status(StatusCode.OK).json(likesArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
const likeController = new LikeController();
export const likeRouter = likeController.router;
