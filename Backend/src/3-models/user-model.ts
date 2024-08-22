import mongoose, { Document, Schema, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";
import { IPostModel } from "./post-model";

export type Address = {
    state: string;
    region: string;
    city: string;
};

export type UserDetails = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: number;
    gender: string;
    birthday: string;
};

export interface IUserModel extends Document {
    userDetails: UserDetails;
    address: Address;
    friendRequests: Map<string, IUserModel>;
    sentFriendRequests: Map<string, IUserModel>;
    friends: Map<string, IUserModel>;
    profileImage: string;
    coverImage: string;
    postsAlbum: string[];
    profileAlbum: string[];
    coverAlbum: string[];
    bio: string;
    posts: Map<string, IPostModel>;
    likedPosts: Map<string, IPostModel>;
    isActive: boolean;
    lastSeen: Date;
}

export const UserSchema = new Schema<IUserModel>(
    {
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
    },
    { timestamps: true, toJSON: { virtuals: true }, id: false, versionKey: false }
);

UserSchema.virtual("photos").get(function (
    this: IUserModel & { profileImage: string; coverImage: string }
) {
    return {
        profileImage: this.profileImage
            ? appConfig.postsImageUrl + this.profileImage
            : null,
        coverImage: this.coverImage
            ? appConfig.postsImageUrl + this.coverImage
            : null,
    };
});

UserSchema.virtual("postsPhotos").get(function (
    this: IUserModel & { postsAlbum: string[] }
) {
    return {
        postsAlbum: this.postsAlbum?.map(
            (postImage) => appConfig.postsImageUrl + postImage
        ),
    };
});

export const UserModel = model<IUserModel>("UserModel", UserSchema, "users");
