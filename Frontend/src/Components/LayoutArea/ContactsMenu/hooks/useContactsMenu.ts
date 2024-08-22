import { UserModel } from "../../../../Models/UserModel";
import { usersService } from "../../../../Services/UsersService";
import { notify } from "../../../../Utils/Notify";
import { useAppSelectors } from "../../../hooks/AppSelectors/useAppSelectors";

export const useContactsMenu = () => {

    //     const currentUser = useAppSelector((state) => state?.auth);

    //   const users = useAppSelector((state) => state?.users);

    //   console.log(users);


    // const { user, currentUser } = useAppSelectors()

    // const findUser = users?.get(currentUser._id);


    // const acceptFriendRequest = async (sender: UserModel, receiver: UserModel): Promise<void> => {
    //     try {
    //         await usersService.acceptFriendRequest({ sender, receiver })
    //         notify.success("Friend request accepted")
    //     } catch (err: any) {
    //         notify.error(err)
    //     }
    // }

    // const declineFriendRequest = async (senderId: string, receiverId: string): Promise<void> => {
    //     try {
    //         await usersService.declineFriendRequest(senderId, receiverId)
    //         notify.success("Friend request decline")
    //     } catch (err: any) {
    //         notify.error(err)
    //     }
    // }


    // return {
    //     user,
    //     users,
    //     findUser,
    //     acceptFriendRequest,
    //     declineFriendRequest
    // }
}