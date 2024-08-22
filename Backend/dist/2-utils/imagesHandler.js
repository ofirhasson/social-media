var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import { fileSaver } from "uploaded-file-saver";
import { ResourceNotFoundError } from "../3-models/client-errors";
class ImagesHandler {
    getImagesNamesArr(model, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield model.findById(_id).select("imageNames");
                if (!post) {
                    throw new ResourceNotFoundError(_id);
                }
                const imagesNames = (post === null || post === void 0 ? void 0 : post.imageNames) || [];
                return imagesNames;
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    extractImagesArrFromRequest(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imagesArr = [];
                const images = (_a = request.files) === null || _a === void 0 ? void 0 : _a.images;
                Array.isArray(images) ? (imagesArr = images) : imagesArr.push(images);
                return imagesArr;
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    getImageFile(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { imageName, folderPath } = request.params;
                const fullImagePath = path.resolve(__dirname, "..", "1-assets", folderPath, imageName);
                response.sendFile(fullImagePath);
            }
            catch (err) {
                next(err);
            }
        });
    }
    configureFileSaver(folder1, folder2) {
        const basePath = path.resolve(__dirname, "../");
        const assetPath = path.join(basePath, `${folder1}`, `${folder2}`);
        fileSaver.config(assetPath);
    }
    addImagesArr(images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (images && images.length > 0) {
                    const imagesArr = Array.from(images);
                    const imagesNames = yield Promise.all(imagesArr === null || imagesArr === void 0 ? void 0 : imagesArr.map((image) => __awaiter(this, void 0, void 0, function* () { return yield fileSaver.add(image); })));
                    return imagesNames;
                }
            }
            catch (err) {
                console.log({ errAddImagesNames: err.message });
            }
        });
    }
    updateImagesArr(model, _id, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldImagesNames = (yield this.getImagesNamesArr(model, _id)) || [];
                const imagesArr = Array.from(images);
                if (images && images.length > 0) {
                    const imagesNames = Promise.all(imagesArr === null || imagesArr === void 0 ? void 0 : imagesArr.map((image, index) => __awaiter(this, void 0, void 0, function* () {
                        const oldImageName = oldImagesNames[index];
                        if (oldImageName) {
                            return yield fileSaver.update(oldImageName, image);
                        }
                        else {
                            return yield fileSaver.add(image);
                        }
                    })));
                    return imagesNames;
                }
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    deleteImagesArr(imageNames) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all(imageNames.map((image) => __awaiter(this, void 0, void 0, function* () { return yield fileSaver.delete(image); })));
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    addImage(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageName = yield fileSaver.add(image);
                return imageName;
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    getImageName(model, _id, select) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield model.findById(_id).select(select).lean();
                if (!value) {
                    throw new ResourceNotFoundError(_id);
                }
                const imageName = value[select];
                return imageName;
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    updateImage(model, _id, image, select) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldImageName = yield this.getImageName(model, _id, select);
                const newImageName = image
                    ? yield fileSaver.update(oldImageName, image)
                    : oldImageName;
                console.log("Image updated from", oldImageName, "to", newImageName);
                return newImageName;
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    deleteImage(imageName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fileSaver.delete(imageName);
        });
    }
}
export const imagesHandler = new ImagesHandler();
