"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.CommentSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const app_config_1 = require("../2-utils/app-config");
exports.CommentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "UserModel",
        required: [true, "Missing user id"],
    },
    targetPostId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "PostModel",
        required: [true, "Missing post id"],
    },
    text: {
        type: String,
        required: [true, "Missing text"],
    },
    imageName: {
        type: String,
    },
    likes: {
        type: Map,
        of: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "LikeModel" },
        default: {},
    },
    replies: {
        type: Map,
        of: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "ReplyModel" },
        default: {},
    },
}, { timestamps: true, id: false, toJSON: { virtuals: true }, versionKey: false });
exports.CommentSchema.virtual("photos").get(function () {
    return {
        imageName: this.imageName
            ? app_config_1.appConfig.commentImageUrl + this.imageName
            : null,
    };
});
exports.CommentModel = (0, mongoose_1.model)("CommentModel", exports.CommentSchema, "comments");
