import axios from "axios";
import { UserModel } from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import { appStore } from "../Redux/Store";
import { userActionCreators } from "../Redux/UserSlice";
import { genericFormData } from "../Utils/GenericFormData";

type FriendRequest = {
  senderId: Partial<UserModel>;
  receiverId: Partial<UserModel>;
};

class UsersService {
  public async getAllUsers(): Promise<UserModel[]> {
    const response = await axios.get<UserModel[]>(appConfig.usersUrl);
    appStore.dispatch(userActionCreators.initUsers(response.data));
    return response.data;
  }

  public async getOneUser(_id: string): Promise<UserModel> {
    const users: UserModel[] = appStore.getState().users;
    const user = users.find((user) => user._id === _id);
    if (user) {
      return user;
    }
    const response = await axios.get<UserModel>(
      `${appConfig.usersUrl}/user/${_id}`
    );
    return response.data;
  }

  public async sendFriendRequest(
    senderId: string,
    receiverId: string
  ): Promise<FriendRequest> {
    const response = await axios.post<FriendRequest>(
      `${appConfig.usersUrl}send-friend-request/${senderId}/${receiverId}`
    );
 
    return response.data;
  }

  public async acceptFriendRequest(
    senderId: string,
    receiverId: string
  ): Promise<FriendRequest> {
    const response = await axios.post<FriendRequest>(
      `${appConfig.usersUrl}accept-friend-request/${senderId}/${receiverId}`
    );
    return response.data;
  }

  public async updateUser(user: UserModel): Promise<void> {
    const data = genericFormData.createFormData(user);
    await axios.put<UserModel>(`${appConfig.usersUrl}user/${user._id}`, data);
    appStore.dispatch(userActionCreators.updateUser(user));
  }

  public async deleteUser(_id: string): Promise<void> {
    await axios.delete<UserModel>(`${appConfig.usersUrl}user/${_id}`);
    appStore.dispatch(userActionCreators.deleteUser(_id));
  }
}

export const usersService = new UsersService();
