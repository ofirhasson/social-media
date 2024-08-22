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
exports.repliesRouter = void 0;
const express_1 = __importDefault(require("express"));
const reply_model_1 = require("../3-models/reply-model");
const replies_service_1 = require("../5-services/replies-service");
const enums_1 = require("../3-models/enums");
const imagesHandler_1 = require("../2-utils/imagesHandler");
class RepliesController {
    constructor() {
        this.router = express_1.default.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post("/reply", this.addReply);
        this.router.put("/reply/:replyId", this.updateReply);
        this.router.delete("/reply/:replyId", this.deleteReply);
    }
    addReply(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const image = (_a = request === null || request === void 0 ? void 0 : request.files) === null || _a === void 0 ? void 0 : _a.image;
                if (image) {
                    imagesHandler_1.imagesHandler.configureFileSaver("1-assets", "replies-images");
                    const imageName = yield imagesHandler_1.imagesHandler.addImage(image);
                    request.body = imageName;
                }
                const reply = new reply_model_1.ReplyModel(request.body);
                const repliesArr = yield replies_service_1.repliesService.addReply(reply);
                response.status(enums_1.StatusCode.Created).json(repliesArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateReply(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                request.body._id = request.params.replyId;
                const image = (_a = request === null || request === void 0 ? void 0 : request.files) === null || _a === void 0 ? void 0 : _a.image;
                if (image) {
                    imagesHandler_1.imagesHandler.configureFileSaver("1-assets", "replies-images");
                    const imageName = yield imagesHandler_1.imagesHandler.updateImage(reply_model_1.ReplyModel, request.body.replayId, request.body.imageName, enums_1.ImageType.ImageName);
                    request.body.imageName = imageName;
                }
                const reply = new reply_model_1.ReplyModel(request.body);
                const repliesArr = yield replies_service_1.repliesService.updateReply(reply);
                response.status(enums_1.StatusCode.Created).json(repliesArr);
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
                const repliesArr = yield replies_service_1.repliesService.deleteReply(replyId);
                response.status(enums_1.StatusCode.OK).json(repliesArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
const repliesController = new RepliesController();
exports.repliesRouter = repliesController.router;
