import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { Model } from "mongoose";
import path from "path";
import { fileSaver } from "uploaded-file-saver";
import { ResourceNotFoundError } from "../3-models/client-errors";
import { IPostModel } from "../3-models/post-model";
import { ImageType } from "../3-models/enums";
import { IUserModel } from "../3-models/user-model";
import { ICommentModel } from "../3-models/comment-model";
import { IReplyModel } from "../3-models/reply-model";

class ImagesHandler {
    public async getImagesNamesArr<T extends IPostModel>(
        model: Model<T>,
        _id: string
    ): Promise<string[]> {
        try {
            const post = await model.findById(_id).select("imageNames");
            if (!post) {
                throw new ResourceNotFoundError(_id);
            }
            const imagesNames = post?.imageNames || [];
            return imagesNames as string[];
        } catch (err: any) {
            console.log(err.message);
        }
    }

    public async extractImagesArrFromRequest(
        request: Request
    ): Promise<UploadedFile[]> {
        try {
            let imagesArr: UploadedFile[] = [];
            const images = request.files?.images;
            Array.isArray(images) ? (imagesArr = images) : imagesArr.push(images);
            return imagesArr;
        } catch (err: any) {
            console.log(err.message);
        }
    }

    public async getImageFile(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { imageName, folderPath } = request.params;

            const fullImagePath = path.resolve(
                __dirname,
                "..",
                "1-assets",
                folderPath,
                imageName
            );
            response.sendFile(fullImagePath);

        } catch (err: any) {
            next(err);
        }
    }

    public configureFileSaver(folder1: string, folder2: string): void {
        const basePath = path.resolve(__dirname, "../"); // Go up one level from the current directory
        const assetPath = path.join(basePath, `${folder1}`, `${folder2}`);
        fileSaver.config(assetPath);
    }

    public async addImagesArr(images: UploadedFile[]): Promise<string[]> {
        try {
            if (images && images.length > 0) {
                const imagesArr: UploadedFile[] = Array.from(images);
                const imagesNames = await Promise.all(
                    imagesArr?.map(async (image) => await fileSaver.add(image))
                );

                return imagesNames;
            }
        } catch (err: any) {
            console.log({ errAddImagesNames: err.message });
        }
    }

    public async updateImagesArr<T extends IPostModel>(
        model: Model<T>,
        _id: string,
        images: UploadedFile[]
    ): Promise<string[]> {
        try {
            const oldImagesNames = (await this.getImagesNamesArr(model, _id)) || [];
            const imagesArr: UploadedFile[] = Array.from(images);
            if (images && images.length > 0) {
                const imagesNames = Promise.all(
                    imagesArr?.map(async (image, index) => {
                        const oldImageName = oldImagesNames[index];
                        if (oldImageName) {
                            return await fileSaver.update(oldImageName, image);
                        } else {
                            return await fileSaver.add(image);
                        }
                    })
                );
                return imagesNames;
            }
        } catch (err: any) {
            console.log(err.message);
        }
    }

    public async deleteImagesArr(imageNames: string[]) {
        try {
            await Promise.all(
                imageNames.map(async (image) => await fileSaver.delete(image))
            );
        } catch (err: any) {
            console.log(err.message);
        }
    }

    public async addImage(image: UploadedFile): Promise<string> {
        try {
            const imageName = await fileSaver.add(image);
            return imageName;
        } catch (err: any) {
            console.log(err.message);
        }
    }

    public async getImageName<T extends IUserModel | ICommentModel | IReplyModel>(
        model: Model<T>,
        _id: string,
        select: ImageType
    ): Promise<string> {
        try {
            const value = await model.findById(_id).select(select).lean();
            if (!value) {
                throw new ResourceNotFoundError(_id);
            }
            const imageName = value[select];
            return imageName;
        } catch (err: any) {
            console.log(err.message);
        }
    }

    public async updateImage<T extends IUserModel | ICommentModel | IReplyModel>(
        model: Model<T>,
        _id: string,
        image: UploadedFile,
        select: ImageType
    ): Promise<string> {
        try {
            const oldImageName = await this.getImageName(model, _id, select);
            const newImageName = image
                ? await fileSaver.update(oldImageName, image)
                : oldImageName;
            console.log("Image updated from", oldImageName, "to", newImageName);
            return newImageName;
        } catch (err: any) {
            console.log(err.message);
        }
    }

    public async deleteImage(imageName: string): Promise<void> {
        await fileSaver.delete(imageName);
    }
}

export const imagesHandler = new ImagesHandler();
