import { convertToMap } from "../Utils/convertToMap";
import { PostModel } from "./PostModel";

export type Address = {
    state: string;
    region: string;
    city: string;
};

export type Photos = {
    profileImage: string;
    coverImage: string;
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

export class UserModel {
    _id: string;
    userDetails: UserDetails;
    address: Address;
    friendRequests: Map<string, UserModel>;
    sentFriendRequests: Map<string, UserModel>;
    friends: Map<string, UserModel>;
    profileImage: string;
    coverImage: string;
    postsAlbum: string[];
    profileAlbum: string[];
    coverAlbum: string[];
    bio: string;
    posts: Map<string, PostModel>;
    likedPosts: Map<string, PostModel>;
    isActive: boolean;
    lastSeen: Date;
    photos: Photos;

    public constructor(user?: UserModel) {
        this._id = user._id || "";
        this.userDetails = user.userDetails;
        this.address = user.address;
        this.friendRequests = convertToMap(user.friendRequests, UserModel) || new Map();
        this.sentFriendRequests = convertToMap(user.sentFriendRequests, UserModel) || new Map();
        this.friends = convertToMap(user.friends, UserModel) || new Map();
        this.profileImage = user.profileImage || "";
        this.coverImage = user.coverImage || "";
        this.postsAlbum = user.postsAlbum || [];
        this.profileAlbum = user.profileAlbum || [];
        this.coverAlbum = user.coverAlbum || [];
        this.bio = user.bio || "";
        this.posts = convertToMap(user.posts, PostModel) || new Map();
        this.likedPosts = convertToMap(user.likedPosts, PostModel) || new Map();
        this.isActive = user.isActive || true;
        this.lastSeen = user.lastSeen || new Date();
        this.photos = user.photos;
    }

}
