import express, { Request, Response, NextFunction } from "express";
import { ReplyModel } from "../3-models/reply-model";
import { repliesService } from "../5-services/replies-service";
import { UploadedFile } from "express-fileupload";
import { ImageType, StatusCode } from "../3-models/enums";

import { imagesHandler } from "../2-utils/imagesHandler";

class RepliesController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.post("/reply", this.addReply);
    this.router.put("/reply/:replyId", this.updateReply);
    this.router.delete("/reply/:replyId", this.deleteReply);
  }

  private async addReply(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    //   request.body.userId = request.query.userId as string;
    //   request.body.commentId = request.query.commentId as string;
      const image = request?.files?.image as UploadedFile;

      if (image) {
        imagesHandler.configureFileSaver("1-assets", "replies-images");
        const imageName = await imagesHandler.addImage(image);
        request.body = imageName;
      }

      const reply = new ReplyModel(request.body);
      const addedReply = await repliesService.addReply(reply);
      response.status(StatusCode.Created).json(addedReply);
    } catch (err: any) {
      next(err);
    }
  }

  private async updateReply(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    //   request.body.userId = request.query.userId as string;
      //   request.body.commentId = request.query.commentId as string;
      request.body.replyId = request.params.replyId;
      const image = request?.files?.image as UploadedFile;

      if (image) {
        imagesHandler.configureFileSaver("1-assets", "replies-images");
        const imageName = await imagesHandler.updateImage(
          ReplyModel,
          request.body.replayId,
          request.body.imageName,
          ImageType.ImageName
        );
        request.body.imageName = imageName;
      }

      const reply = new ReplyModel(request.body);

      const updatedReply = await repliesService.updateReply(reply);
      response.status(StatusCode.Created).json(updatedReply);
    } catch (err: any) {
      next(err);
    }
  }

  private async deleteReply(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { replyId } = request.params;
      await repliesService.deleteReply(replyId);
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }
}

const repliesController = new RepliesController();
export const repliesRouter = repliesController.router;
