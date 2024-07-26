import express, { NextFunction, Request, Response } from "express";
import { LikeTarget, StatusCode } from "../3-models/enums";
import { likeService } from "../5-services/like-service";
import { LikeModel } from "../3-models/like-model";

class LikeController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.post("/like/add-like", this.addLike);
    this.router.post("/like/delete-like", this.deleteLike);
  }

  private async addLike(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const like = new LikeModel(request.body);
      if (
        ![LikeTarget.Post, LikeTarget.Comment, LikeTarget.Reply].includes(
          like.targetType
        )
      ) {
        throw new Error("Invalid target type");
      }
      const addedLike = await likeService.addLike(like);
      response.sendStatus(StatusCode.Created).json(addedLike);
    } catch (err: any) {
      next(err);
    }
  }

  private async deleteLike(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const like = new LikeModel(request.body);

      if (
        ![LikeTarget.Post, LikeTarget.Comment, LikeTarget.Reply].includes(
          like.targetType
        )
      ) {
        throw new Error("Invalid target type");
      }
      const removeLike = await likeService.removeLike(like);
      response.sendStatus(StatusCode.Created).json(removeLike);
    } catch (err: any) {
      next(err);
    }
  }
}

const likeController = new LikeController();
export const likeRouter = likeController.router;
