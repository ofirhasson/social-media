import axios from "axios";
import { UserModel } from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import { appStore } from "../Redux/Store";
// import { userActionCreators } from "../Redux/Slices/UsersSlice";
import { genericFormData } from "../Utils/GenericFormData";

type FriendRequest = {
    sender: UserModel;
    receiver: UserModel;
};

class UsersService {
    public async getAllUsers(): Promise<Map<string, UserModel>> {
        const response = await axios.get<Map<string, UserModel>>(appConfig.usersUrl);
        // appStore.dispatch(userActionCreators.initUsers(response.data));
        return response.data;
    }

    // public async getOneUser(_id: string): Promise<UserModel> {
    //     const users = appStore.getState().users;
    //     const user = users.get(_id);
    //     if (user) {
    //         return user;
    //     }
    //     const response = await axios.get<UserModel>(
    //         `${appConfig.usersUrl}/user/${_id}`
    //     );
    //     return response.data;
    // }

    public async sendFriendRequest({sender,receiver}: FriendRequest): Promise<FriendRequest> {
        const response = await axios.put<FriendRequest>(
            `${appConfig.usersUrl}send-friend-request/${sender._id}/${receiver._id}`
        );

        // appStore.dispatch(userActionCreators.sendFriendRequest(response.data));

        return response.data;
    }

    public async acceptFriendRequest({
        sender,
        receiver,
    }: FriendRequest): Promise<FriendRequest> {
        const response = await axios.put<FriendRequest>(
            `${appConfig.usersUrl}accept-friend-request/${sender._id}/${receiver._id}`
        );
        // appStore.dispatch(userActionCreators.acceptFriendRequest(response.data));
        return response.data;
    }

    public async declineFriendRequest(
        senderId: string,
        receiverId: string
    ): Promise<void> {
        await axios.put<FriendRequest>(`${appConfig.usersUrl}delete-friend-request/${senderId}/${receiverId}`);

        // appStore.dispatch(
        //     userActionCreators.declineFriendRequest({ senderId, receiverId })
        // );
    }

    public async updateUser(user: UserModel): Promise<void> {
        const data = genericFormData.createFormData(user);
        await axios.put<UserModel>(`${appConfig.usersUrl}user/${user._id}`, data);
        // appStore.dispatch(userActionCreators.updateUser(user));
    }

    public async deleteUser(_id: string): Promise<void> {
        await axios.delete<UserModel>(`${appConfig.usersUrl}user/${_id}`);
        // appStore.dispatch(userActionCreators.deleteUser(_id));
    }
}

export const usersService = new UsersService();
