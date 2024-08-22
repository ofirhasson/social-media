import { memo } from "react";
import userCircle from "../../../Assets/Images/user-circle-regular-24.png";
import { useContactsMenu } from "./hooks/useContactsMenu";

function ContactsMenuComponent(): JSX.Element {
    // const { acceptFriendRequest, declineFriendRequest, user, findUser } =
    //     useContactsMenu();

    return (
        // <div className="bg-gray-100 h-full bg-opacity-85 pt-3">
        //     <div className="h-full">
        //         <div className="flex justify-between items-center px-4 ">
        //             <span className="font-semibold text-gray-500 text-lg dark:text-dark-txt">
        //                 Friend requests
        //             </span>
        //             <span className="text-blue-500 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-third p-2 rounded-md">
        //                 See All
        //             </span>
        //         </div>
        //         <div className="p-2">
        //             {Array.from(findUser?.friendRequests?.values() || []).map((u) => (
        //                 <a
        //                     href="#"
        //                     key={u?._id}
        //                     className="flex items-center space-x-4 hover:bg-gray-200 dark:hover:bg-dark-third rounded-lg transition-all"
        //                 >
        //                     <img
        //                         className="rounded-full h-14 w-14"
        //                         src={
        //                             u?.photos?.profileImage !== null
        //                                 ? u?.photos?.profileImage
        //                                 : userCircle
        //                         }
        //                         alt="Profile picture"
        //                     />
        //                     <div className="flex-1 h-full">
        //                         <div className="dark:text-dark-txt flex mt-3 ">
        //                             <span className="font-semibold  mr-14">
        //                                 {u?.userDetails?.firstName} {""}
        //                                 {u?.userDetails?.lastName} {""}
        //                             </span>
        //                             <span className="float-right text-black">6d</span>
        //                             &nbsp;
        //                         </div>
        //                         <div className="flex space-x-2 mt-2">
        //                             <div
        //                                 onClick={() => acceptFriendRequest(u, user)}
        //                                 className="w-1/2 bg-blue-500 cursor-pointer py-1 text-center font-semibold text-white rounded-lg"
        //                             >
        //                                 Confirm
        //                             </div>
        //                             <div
        //                                 onClick={() => declineFriendRequest(u._id, user._id)}
        //                                 className="w-1/2 bg-gray-300 cursor-pointer py-1 text-center font-semibold text-black rounded-lg"
        //                             >
        //                                 Ignore
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </a>
        //             ))}
        //         </div>
        //         <div className="border-b border-gray-400 dark:border-dark-third mt-6"></div>
        //         {/* contacts */}

        //         <div className="flex justify-between items-center px-4 pt-4 text-gray-500 dark:text-dark-txt">
        //             <span className="font-semibold text-lg">Contacts</span>
        //             <div className="flex space-x-1">
        //                 <div className="w-8 h-8 grid place-items-center text-xl hover:bg-gray-200 dark:hover:bg-dark-third rounded-full cursor-pointer">
        //                     <i className="bx bx-search"></i>
        //                 </div>
        //                 <div className="grid place-items-center ">
        //                     <input
        //                         type="search"
        //                         className="border-2 border-black rounded-xl w-36 pl-2"
        //                     />
        //                 </div>
        //                 <div className="w-8 h-8 grid place-items-center text-xl hover:bg-gray-200 dark:hover:bg-dark-third rounded-full cursor-pointer">
        //                     <i className="bx bx-dots-horizontal-rounded"></i>
        //                 </div>
        //             </div>
        //         </div>

        //         <ul className="p-2">
        //             {Array.from(findUser?.friends?.values() || []).map((u) => (
        //                 <li key={u._id}>
        //                     <div className="flex items-center space-x-4 p-2 hover:bg-gray-200 dark:hover:bg-dark-third dark:text-dark-txt rounded-lg cursor-pointer">
        //                         <div className="relative">
        //                             <img
        //                                 src={
        //                                     u?.photos?.profileImage
        //                                         ? u.photos.profileImage
        //                                         : userCircle
        //                                 }
        //                                 alt="Profile picture"
        //                                 className="rounded-full w-10 h-10"
        //                             />
        //                             <span
        //                                 className={`${u.isActive ? "bg-green-500" : "bg-red-500"
        //                                     } absolute right-0 top-3/4 border-white border-2  w-3 h-3 rounded-full`}
        //                             ></span>
        //                         </div>
        //                         <div>
        //                             <span>
        //                                 {u?.userDetails?.firstName} {u?.userDetails?.lastName}
        //                             </span>
        //                         </div>
        //                     </div>
        //                 </li>
        //             ))}
        //         </ul>
        //         {/* end contacts */}
        //     </div>
        // </div>
        <div>

        </div>
    );
}
export const ContactsMenu = memo(ContactsMenuComponent);
