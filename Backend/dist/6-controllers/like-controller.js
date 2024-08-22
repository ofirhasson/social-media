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
exports.likeRouter = void 0;
const express_1 = __importDefault(require("express"));
const enums_1 = require("../3-models/enums");
const like_service_1 = require("../5-services/like-service");
const like_model_1 = require("../3-models/like-model");
class LikeController {
    constructor() {
        this.router = express_1.default.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post("/like/add-like", this.addLike);
        this.router.post("/like/delete-like/:_id([a-f0-9A-F]{24})", this.deleteLike);
    }
    addLike(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const like = new like_model_1.LikeModel(request.body);
                if (![enums_1.LikeTarget.Post, enums_1.LikeTarget.Comment, enums_1.LikeTarget.Reply].includes(like.targetType)) {
                    throw new Error("Invalid target type");
                }
                const likesArr = yield like_service_1.likeService.addLike(like);
                response.status(enums_1.StatusCode.Created).json(likesArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteLike(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const likesArr = yield like_service_1.likeService.removeLike((_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a._id);
                response.status(enums_1.StatusCode.OK).json(likesArr);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
const likeController = new LikeController();
exports.likeRouter = likeController.router;
