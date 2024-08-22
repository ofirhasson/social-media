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
exports.postRouter = exports.PostController = void 0;
const express_1 = __importDefault(require("express"));
const imagesHandler_1 = require("../2-utils/imagesHandler");
const enums_1 = require("../3-models/enums");
const post_model_1 = require("../3-models/post-model");
const post_service_1 = require("../5-services/post-service");
class PostController {
    constructor() {
        this.router = express_1.default.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get("/posts/target", this.getAllPostsByTargetUser);
        this.router.get("/posts/:postId", this.getPostById);
        this.router.post("/posts", this.createPost);
        this.router.put("/posts/:postId", this.updatePost);
        this.router.delete("/posts/:postId", this.deletePost);
        this.router.get("/social-media/images/:folderPath/:imageName/", imagesHandler_1.imagesHandler.getImageFile);
    }
    getAllPostsByTargetUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = request.query.userId;
                const targetUserId = request.query.targetUserId;
                const posts = yield post_service_1.postService.getAllPostsByTargetUser(userId, targetUserId);
                response.json(posts);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPostById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = request.params.postId;
                const userId = request.query.userId;
                const post = yield post_service_1.postService.getPostById(postId, userId);
                response.json(post);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createPost(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imagesArr = request.files.images
                    ? yield imagesHandler_1.imagesHandler.extractImagesArrFromRequest(request)
                    : [];
                imagesHandler_1.imagesHandler.configureFileSaver("1-assets", "posts-images");
                const imagesNames = yield imagesHandler_1.imagesHandler.addImagesArr(imagesArr);
                request.body.imageNames = imagesNames;
                const post = new post_model_1.PostModel(request.body);
                const addedPost = yield post_service_1.postService.createPost(post);
                response.status(enums_1.StatusCode.Created).json(addedPost);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePost(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const postId = request.params.postId;
                request.body._id = postId;
                if ((_a = request === null || request === void 0 ? void 0 : request.files) === null || _a === void 0 ? void 0 : _a.images) {
                    const imagesArr = yield imagesHandler_1.imagesHandler.extractImagesArrFromRequest(request);
                    imagesHandler_1.imagesHandler.configureFileSaver("1-assets", "posts-images");
                    const imageNames = yield imagesHandler_1.imagesHandler.updateImagesArr(post_model_1.PostModel, request.body._id, imagesArr);
                    request.body.imageNames = imageNames;
                }
                const post = new post_model_1.PostModel(request.body);
                const updatedPost = yield post_service_1.postService.updatePost(post);
                response.json(updatedPost);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deletePost(post, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const postId = (_a = post === null || post === void 0 ? void 0 : post.params) === null || _a === void 0 ? void 0 : _a.postId;
                yield post_service_1.postService.deletePost(postId);
                response.sendStatus(enums_1.StatusCode.NoContent);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.PostController = PostController;
const postController = new PostController();
exports.postRouter = postController.router;
