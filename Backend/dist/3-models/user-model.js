import mongoose, { Schema, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";
export const UserSchema = new Schema({
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
        of: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
        default: {},
    },
    sentFriendRequests: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
        default: {},
    },
    friends: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
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
        of: { type: mongoose.Schema.Types.ObjectId, ref: "PostModel" },
        default: {},
    },
    likedPosts: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: "PostModel" },
        default: {},
    },
    lastSeen: {
        type: Date,
    },
    isActive: {
        type: Boolean,
    },
}, { timestamps: true, toJSON: { virtuals: true }, id: false, versionKey: false });
UserSchema.virtual("photos").get(function () {
    return {
        profileImage: this.profileImage
            ? appConfig.postsImageUrl + this.profileImage
            : null,
        coverImage: this.coverImage
            ? appConfig.postsImageUrl + this.coverImage
            : null,
    };
});
UserSchema.virtual("postsPhotos").get(function () {
    var _a;
    return {
        postsAlbum: (_a = this.postsAlbum) === null || _a === void 0 ? void 0 : _a.map((postImage) => appConfig.postsImageUrl + postImage),
    };
});
export const UserModel = model("UserModel", UserSchema, "users");
