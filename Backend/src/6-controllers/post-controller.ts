import express, { NextFunction, Request, Response } from "express";
// Adjust the import path
import { imagesHandler } from "../2-utils/imagesHandler";
import { StatusCode } from "../3-models/enums";
import { PostModel } from "../3-models/post-model";
import { postService } from "../5-services/post-service";

export class PostController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get("/posts/target", this.getAllPostsByTargetUser);
    this.router.get("/posts/:postId", this.getPostById);
    this.router.post("/posts", this.createPost);
    this.router.put("/posts/:postId", this.updatePost);
    this.router.delete("/posts/:postId", this.deletePost);
    this.router.get(
      "/social-media/images/:folderPath/:imageName/",
      imagesHandler.getImageFile
    );
  }

  private async getAllPostsByTargetUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.query.userId as string;
      const targetUserId = request.query.targetUserId as string;
      const posts = await postService.getAllPostsByTargetUser(
        userId,
        targetUserId
      );
      response.json(posts);
    } catch (error) {
      next(error);
    }
  }

  private async getPostById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postId = request.params.postId;
      const userId = request.query.userId as string;
      const post = await postService.getPostById(postId, userId);
      response.json(post);
    } catch (error) {
      next(error);
    }
  }

  private async createPost(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //   request.body.userId = request.query.userId as string;
      //   request.body.targetUserId = request.query.targetUserId as string;

      const imagesArr = request.files.images
        ? await imagesHandler.extractImagesArrFromRequest(request)
        : [];

      imagesHandler.configureFileSaver("1-assets", "posts-images");
      const imagesNames = await imagesHandler.addImagesArr(imagesArr);
      request.body.imageNames = imagesNames;

      const post = new PostModel(request.body);

      const addedPost = await postService.createPost(post);

      response.status(StatusCode.Created).json(addedPost);
    } catch (error) {
      next(error);
    }
  }

  private async updatePost(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postId = request.params.postId;
      // request.body.userId = request.query.userId;
      request.body._id = postId;

      const imagesArr =
        request?.files?.images !== null
          ? await imagesHandler.extractImagesArrFromRequest(request)
          : [];

      imagesHandler.configureFileSaver("1-assets", "posts-images");
      const imageNames = await imagesHandler.updateImagesArr(
        PostModel,
        request.body._id,
        imagesArr
      );
      request.body.imageNames = imageNames;

      const post = new PostModel(request.body);

      const updatedPost = await postService.updatePost(post);

      response.json(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  private async deletePost(
    post: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postId = post?.params?.postId;
      await postService.deletePost(postId);
      response.sendStatus(StatusCode.NoContent); // No content to return for a successful deletion
    } catch (error) {
      next(error);
    }
  }
}

const postController = new PostController();
export const postRouter = postController.router;
