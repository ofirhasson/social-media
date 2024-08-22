import { Types } from "mongoose";
import { cyber } from "../2-utils/cyber";
import { imagesHandler } from "../2-utils/imagesHandler";
import { getPopulatedSpecialFieldsUserService } from "../2-utils/populatedPath";
import { ResourceNotFoundError, ValidationError, } from "../3-models/client-errors";
import { CommentModel } from "../3-models/comment-model";
import { LikeModel } from "../3-models/like-model";
import { PostModel } from "../3-models/post-model";
import { ReplyModel } from "../3-models/reply-model";
import { IUserModel, UserModel } from "../3-models/user-model";
import { authService } from "./auth-service";
import { postService } from "./post-service";


class UsersService {
    public getPopulatedFields(): string[] {
        return [
            "friendRequests",
            "sentFriendRequests",
            "posts",
            "friends",
            "likedPosts",
        ];
    }

    public async getAllUsers(): Promise<Map<string, IUserModel>> {
        const users = await UserModel.find()
            .populate(this.getPopulatedFields())
            .populate(getPopulatedSpecialFieldsUserService)
            .exec();
        const userDictionary = new Map();
        users.forEach(user => {
            userDictionary.set(user._id.toString(), user);
        });
        return userDictionary;
    }

    public async getOneUser(_id: string): Promise<IUserModel> {
        const user = await UserModel.findById(_id)
            .populate(this.getPopulatedFields())
            .populate(getPopulatedSpecialFieldsUserService)
            .exec();
        if (!user) {
            throw new ResourceNotFoundError(_id);
        }
        return user;
    }

    public async sendFriendRequest(senderId: string, receiverId: string): Promise<{ sender: IUserModel; receiver: IUserModel }> {
        const sender = await UserModel.findById(senderId).exec();
        const receiver = await UserModel.findById(receiverId).exec();

        if (!sender) {
            throw new ResourceNotFoundError(senderId);
        }
        if (!receiver) {
            throw new ResourceNotFoundError(receiverId);
        }

        if (
            receiver.friendRequests.has(senderId) ||
            sender.sentFriendRequests.has(receiverId)
        ) {
            throw new Error("Friend request already sent");
        }

        // Update the receiver's friendRequests and sender's sentFriendRequests directly
        receiver.friendRequests.set(senderId, sender);
        sender.sentFriendRequests.set(receiverId, receiver);

        await receiver.save();
        await sender.save();

        // Fetch the updated users
        const updatedSender = await this.getOneUser(senderId);
        const updatedReceiver = await this.getOneUser(receiverId);

        return { sender: updatedSender, receiver: updatedReceiver };
    }

    public async acceptFriendRequest(senderId: string, receiverId: string): Promise<{ sender: IUserModel; receiver: IUserModel }> {
        // Find both users
        const sender = await UserModel.findById(senderId).exec();
        const receiver = await UserModel.findById(receiverId).exec();

        if (!sender) {
            throw new ResourceNotFoundError(senderId);
        }
        if (!receiver) {
            throw new ResourceNotFoundError(receiverId);
        }

        // Check if the sender is in the receiver's friendRequests array
        if (!receiver.friendRequests.has(senderId)) {
            throw new Error("Friend request not found");
        }

        // Add sender to receiver's friends array and vice versa

        receiver.friends.set(senderId, sender);
        sender.friends.set(receiverId, receiver);

        // Remove the friend request from both users
        receiver.friendRequests.delete(sender._id);
        sender.sentFriendRequests.delete(receiver._id);

        await receiver.save();
        await sender.save();

        // Return updated user data
        const updatedSender = await this.getOneUser(senderId);
        const updatedReceiver = await this.getOneUser(receiverId);

        return { sender: updatedSender, receiver: updatedReceiver };
    }

    public async declineFriendRequest(senderId: string, receiverId: string): Promise<void> {

        const sender = await UserModel.findById(senderId).exec();
        const receiver = await UserModel.findById(receiverId).exec();

        if (!sender) {
            throw new ResourceNotFoundError(senderId);
        }
        if (!receiver) {
            throw new ResourceNotFoundError(receiverId);
        }

        // Check if the sender is in the receiver's friendRequests array
        if (!receiver.friendRequests.has(senderId)) {
            throw new Error("Friend request not found");
        }

        // Remove the friend request from both users
        receiver.friendRequests.delete(senderId);
        sender.sentFriendRequests.delete(receiverId);

        await receiver.save();
        await sender.save();
    }

    public async updateUser(user: IUserModel): Promise<IUserModel> {
        const existingUser = await UserModel.findById(user._id);
        if (!existingUser) {
            throw new ResourceNotFoundError(user._id);
        }
        // Check if the email is being updated and if the new email is taken

        if (
            user.userDetails.email &&
            user.userDetails.email !== existingUser.userDetails.email
        ) {
            const isEmailTaken = await authService.isEmailTaken(
                user.userDetails.email
            );
            if (isEmailTaken) {
                throw new ValidationError(
                    "The email is taken. Please choose a different email."
                );
            }
        }

        // Hash the password if it's being updated
        if (
            user.userDetails.password &&
            user.userDetails.password !== existingUser.userDetails.password
        ) {
            user.userDetails.password = cyber.hashPassword(user.userDetails.password);
        } else {
            // If password is not updated, keep the existing password
            user.userDetails.password = existingUser.userDetails.password;
        }

        user.friends = existingUser.friends;
        user.friendRequests = existingUser.friendRequests;
        user.sentFriendRequests = existingUser.sentFriendRequests;
        user.posts = existingUser.posts;
        user.profileAlbum = existingUser.profileAlbum;
        user.coverAlbum = existingUser.coverAlbum;

        if (user.profileImage) {
            user.profileAlbum.push(user.profileImage);

            const profilePost = new PostModel({
                userId: user._id,
                content: "Updated profile picture",
                privacyOptions: "public", // Set appropriate privacy options
                imageNames: [user.profileImage], // Assuming `newProfileImage` is a string
                likes: {},
                comments: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            user.posts.set(profilePost._id.toString(), profilePost);

            await postService.createPost(profilePost);
        }

        if (user.coverImage) {
            user.coverAlbum.push(user.coverImage);
            const coverPost = new PostModel({
                userId: user._id,
                content: "Updated cover picture",
                privacyOptions: "public",
                imageNames: [user.coverImage],
                likes: {},
                comments: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            user.posts.set(coverPost._id.toString(), coverPost)

            await postService.createPost(coverPost);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, {
            new: true,
        }).populate(getPopulatedSpecialFieldsUserService).exec();
        if (!updatedUser) {
            throw new ResourceNotFoundError(user._id);
        }

        // return updatedUser
        return this.getOneUser(updatedUser._id);
    }

    public async deleteUser(_id: string): Promise<void> {
        const userToDelete = await UserModel.findByIdAndDelete(_id).exec();
        if (!userToDelete) {
            throw new ResourceNotFoundError(_id);
        }
        await PostModel.deleteMany({ userId: _id }).exec();
        await LikeModel.deleteMany({ userId: _id }).exec();
        await CommentModel.deleteMany({ userId: _id }).exec();
        await ReplyModel.deleteMany({ userId: _id }).exec();
        await imagesHandler.deleteImage(userToDelete.profileImage);
        await imagesHandler.deleteImage(userToDelete.coverImage);

        // Remove the user from other users' friends, friendRequests, and sentFriendRequests
        await UserModel.updateMany(
            { [`friends.${_id}`]: _id },
            { $unset: { [`friends.${_id}`]: true } }
        ).exec();

        await UserModel.updateMany(
            { [`friendRequests.${_id}`]: _id },
            { $unset: { [`friendRequests.${_id}`]: true } }
        ).exec();

        await UserModel.updateMany(
            { [`sentFriendRequests.${_id}`]: _id },
            { $unset: { [`sentFriendRequests.${_id}`]: true } }
        ).exec();

    }
}

export const usersService = new UsersService();
