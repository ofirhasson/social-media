import express, { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { ImageType, StatusCode } from "../3-models/enums";
import { UserModel } from "../3-models/user-model";
import { usersService } from "../5-services/users-service";
import { imagesHandler } from "../2-utils/imagesHandler";

class UsersController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get("/users", this.getAllUsers);
    this.router.get("/users/user/:_id([a-f0-9A-F]{24})", this.getOneUser);
    this.router.post(
      "/users/send-friend-request/:senderId([a-f0-9A-F]{24})/:receiverId([a-f0-9A-F]{24})",
      this.sendFriendRequest
    );
    this.router.post(
      "/users/accept-friend-request/:senderId([a-f0-9A-F]{24})/:receiverId([a-f0-9A-F]{24})",
      this.acceptFriendRequest
    );
    this.router.put("/users/user/:_id([a-f0-9A-F]{24})", this.updateUser);
    this.router.delete("/users/user/:_id([a-f0-9A-F]{24})", this.deleteUser);
    this.router.get(
      "/social-media/images/:folderPath/:imageName/",
      imagesHandler.getImageFile
    );
  }

  private async getAllUsers(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await usersService.getAllUsers();
      response.json(users);
    } catch (err: any) {
      next(err);
    }
  }

  private async getOneUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { _id } = request.params;
      const user = await usersService.getOneUser(_id);
      response.json(user);
    } catch (err: any) {
      next(err);
    }
  }

  private async sendFriendRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { senderId, receiverId } = request.params;
      const sentFriendRequest = await usersService.sendFriendRequest(
        senderId,
        receiverId
      );
      response.status(StatusCode.Created).json(sentFriendRequest);
    } catch (err: any) {
      next(err);
    }
  }

  private async acceptFriendRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { senderId, receiverId } = request.params;
      const acceptFriendRequest = await usersService.acceptFriendRequest(
        senderId,
        receiverId
      );
      response.status(StatusCode.Created).json(acceptFriendRequest);
    } catch (err: any) {
      next(err);
    }
  }

  private async updateUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      request.body._id = request.params._id;
      const profileImage = request?.files?.profileImage as UploadedFile;
      const coverImage = request?.files?.coverImage as UploadedFile;

      if (profileImage) {
        imagesHandler.configureFileSaver("1-assets", "posts-images");
        const imageName = await imagesHandler.updateImage(
          UserModel,
          request.body._id,
          profileImage,
          ImageType.ProfileImage
        );
        request.body.profileImage = imageName;
      }

      if (coverImage) {
        imagesHandler.configureFileSaver("1-assets", "posts-images");
        const imageName = await imagesHandler.updateImage(
          UserModel,
          request.body._id,
          coverImage,
          ImageType.CoverImage
        );
        request.body.coverImage = imageName;
      }

      const user = new UserModel(request.body);
      console.log({ user: user });

      const updatedUser = await usersService.updateUser(user);

      response.json(updatedUser);
    } catch (err: any) {
      next(err);
    }
  }

  private async deleteUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { _id } = request.params;
      await usersService.deleteUser(_id);
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }
}

const userController = new UsersController();
export const usersRouter = userController.router;
