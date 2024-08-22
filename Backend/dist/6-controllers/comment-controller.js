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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const comment_model_1 = require("../3-models/comment-model");
const enums_1 = require("../3-models/enums");
const comment_service_1 = require("../5-services/comment-service");
const imagesHandler_1 = require("../2-utils/imagesHandler");
class CommentController {
    constructor() {
        this.router = express_1.default.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post("/comment", this.addComment);
        this.router.put("/comment/:_id([a-f0-9A-F]{24})", this.updateComment);
        this.router.delete("/comment/:_id([a-f0-9A-F]{24})", this.deleteComment);
    }
    addComment(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const image = (_a = request === null || request === void 0 ? void 0 : request.files) === null || _a === void 0 ? void 0 : _a.image;
                if (image) {
                    const imageName = yield imagesHandler_1.imagesHandler.addImage(image);
                    request.body.imageName = imageName;
                }
                const comment = new comment_model_1.CommentModel(request.body);
                const commentsArr = yield comment_service_1.commentsService.addComment(comment);
                response.status(enums_1.StatusCode.Created).json(commentsArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateComment(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                request.body._id = (_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a._id;
                const image = (_b = request === null || request === void 0 ? void 0 : request.files) === null || _b === void 0 ? void 0 : _b.image;
                if (image) {
                    const imageName = yield imagesHandler_1.imagesHandler.updateImage(comment_model_1.CommentModel, request.body._id, image, enums_1.ImageType.ImageName);
                    request.body.imageName = imageName;
                }
                const comment = new comment_model_1.CommentModel(request.body);
                const updatedCommentsArr = yield comment_service_1.commentsService.updateComment(comment);
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
                const commentsArr = yield comment_service_1.commentsService.deleteComment(_id);
                response.status(enums_1.StatusCode.OK).json(commentsArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
const commentController = new CommentController();
exports.commentRouter = commentController.router;
