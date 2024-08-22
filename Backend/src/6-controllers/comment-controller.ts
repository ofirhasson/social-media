import express, { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { CommentModel } from "../3-models/comment-model";
import { ImageType, StatusCode } from "../3-models/enums";
import { commentsService } from "../5-services/comment-service";
import { imagesHandler } from "../2-utils/imagesHandler";

class CommentController {
    public readonly router = express.Router();

    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.post("/comment", this.addComment);
        this.router.put("/comment/:_id([a-f0-9A-F]{24})", this.updateComment);
        this.router.delete("/comment/:_id([a-f0-9A-F]{24})", this.deleteComment);
    }

    private async addComment(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            //   request.body.userId = request.query.userId;
            //   request.body.targetPostId = request.query.targetPostId;
            const image = request?.files?.image as UploadedFile;
            if (image) {
                const imageName = await imagesHandler.addImage(image);
                request.body.imageName = imageName;
            }

            const comment = new CommentModel(request.body);
            const commentsArr = await commentsService.addComment(comment);

            response.status(StatusCode.Created).json(commentsArr);
        } catch (err: any) {
            next(err);
        }
    }

    private async updateComment(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            request.body._id = request?.params?._id;
            //   request.body.userId = request.query.userId;
            //   request.body.targetPostId = request.query.targetPostId;

            const image = request?.files?.image as UploadedFile;

            if (image) {
                const imageName = await imagesHandler.updateImage(
                    CommentModel,
                    request.body._id,
                    image,
                    ImageType.ImageName
                );
                request.body.imageName = imageName;
            }

            const comment = new CommentModel(request.body);

            const updatedCommentsArr = await commentsService.updateComment(comment);

            response.json(updatedCommentsArr);
        } catch (err: any) {
            next(err);
        }
    }

    private async deleteComment(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const _id = request.params._id;
            const commentsArr = await commentsService.deleteComment(_id);
            response.status(StatusCode.OK).json(commentsArr);
        } catch (err: any) {
            next(err);
        }
    }
}

const commentController = new CommentController();

export const commentRouter = commentController.router;
