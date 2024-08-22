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
exports.UserModel = exports.UserSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const app_config_1 = require("../2-utils/app-config");
exports.UserSchema = new mongoose_1.Schema({
    userDetails: {
        firstName: {
            type: String,
            required: [true, "Missing first name"],
            minlength: [2, "First name must be minimum 2 characters"],
            maxlength: [20, "First name must be maximum 50 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Missing last name"],
            minlength: [2, "Last name must be minimum 7 characters"],
            maxlength: [20, "Last name must be maximum 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Missing email"],
            minlength: [7, "Email must be minimum 7 characters"],
            maxlength: [50, "Email must be maximum 50 characters"],
        },
        password: {
            type: String,
            required: [true, "Missing password"],
            minlength: [7, "Password must be minimum 7 characters"],
        },
        roleId: {
            type: Number,
            required: [true, "Missing role id"],
        },
        gender: {
            type: String,
            required: [true, "Missing gender"],
        },
        birthday: {
            type: String,
            required: [true, "Missing birthday"],
        },
    },
    address: {
        state: {
            type: String,
        },
        region: {
            type: String,
        },
        city: {
            type: String,
        },
    },
    friendRequests: {
        type: Map,
        of: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "UserModel" },
        default: {},
    },
    sentFriendRequests: {
        type: Map,
        of: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "UserModel" },
        default: {},
    },
    friends: {
        type: Map,
        of: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "UserModel" },
        default: {},
    },
    profileImage: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    profileAlbum: [
        {
            type: String,
            ref: "UserModel",
        },
    ],
    coverAlbum: [
        {
            type: String,
            ref: "UserModel",
        },
    ],
    postsAlbum: [
        {
            type: String,
            ref: "PostModel",
        },
    ],
    bio: {
        type: String,
    },
    posts: {
        type: Map,
        of: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "PostModel" },
        default: {},
    },
    likedPosts: {
        type: Map,
        of: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "PostModel" },
        default: {},
    },
    lastSeen: {
        type: Date,
    },
    isActive: {
        type: Boolean,
    },
}, { timestamps: true, toJSON: { virtuals: true }, id: false, versionKey: false });
exports.UserSchema.virtual("photos").get(function () {
    return {
        profileImage: this.profileImage
            ? app_config_1.appConfig.postsImageUrl + this.profileImage
            : null,
        coverImage: this.coverImage
            ? app_config_1.appConfig.postsImageUrl + this.coverImage
            : null,
    };
});
exports.UserSchema.virtual("postsPhotos").get(function () {
    var _a;
    return {
        postsAlbum: (_a = this.postsAlbum) === null || _a === void 0 ? void 0 : _a.map((postImage) => app_config_1.appConfig.postsImageUrl + postImage),
    };
});
exports.UserModel = (0, mongoose_1.model)("UserModel", exports.UserSchema, "users");
