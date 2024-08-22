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
import { imagesHandler } from "../2-utils/imagesHandler";
import { StatusCode } from "../3-models/enums";
import { PostModel } from "../3-models/post-model";
import { postService } from "../5-services/post-service";
export class PostController {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get("/posts/target", this.getAllPostsByTargetUser);
        this.router.get("/posts/:postId", this.getPostById);
        this.router.post("/posts", this.createPost);
        this.router.put("/posts/:postId", this.updatePost);
        this.router.delete("/posts/:postId", this.deletePost);
        this.router.get("/social-media/images/:folderPath/:imageName/", imagesHandler.getImageFile);
    }
    getAllPostsByTargetUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = request.query.userId;
                const targetUserId = request.query.targetUserId;
                const posts = yield postService.getAllPostsByTargetUser(userId, targetUserId);
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
                const post = yield postService.getPostById(postId, userId);
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
                    ? yield imagesHandler.extractImagesArrFromRequest(request)
                    : [];
                imagesHandler.configureFileSaver("1-assets", "posts-images");
                const imagesNames = yield imagesHandler.addImagesArr(imagesArr);
                request.body.imageNames = imagesNames;
                const post = new PostModel(request.body);
                const addedPost = yield postService.createPost(post);
                response.status(StatusCode.Created).json(addedPost);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePost(request, response, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = request.params.postId;
                request.body._id = postId;
                if ((_a = request === null || request === void 0 ? void 0 : request.files) === null || _a === void 0 ? void 0 : _a.images) {
                    const imagesArr = yield imagesHandler.extractImagesArrFromRequest(request);
                    imagesHandler.configureFileSaver("1-assets", "posts-images");
                    const imageNames = yield imagesHandler.updateImagesArr(PostModel, request.body._id, imagesArr);
                    request.body.imageNames = imageNames;
                }
                const post = new PostModel(request.body);
                const updatedPost = yield postService.updatePost(post);
                response.json(updatedPost);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deletePost(post, response, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = (_a = post === null || post === void 0 ? void 0 : post.params) === null || _a === void 0 ? void 0 : _a.postId;
                yield postService.deletePost(postId);
                response.sendStatus(StatusCode.NoContent);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
const postController = new PostController();
export const postRouter = postController.router;
