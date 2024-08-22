import nikeLogo from "../../../Assets/Images/1-nike-logo-evolution.webp";
import facebookFriends from "../../../Assets/Images/Facebook-Friend_bg_removed_bg_removed.png";
import facebookGroups from "../../../Assets/Images/facebook-groups.png";
import facebookPages from "../../../Assets/Images/Facebook-Page.png";
import javaScriptLogo from "../../../Assets/Images/js-logo.png";
import KWLogo from "../../../Assets/Images/Keller-Williams.jpg";
import adidasLogo from "../../../Assets/Images/kisspng-adidas-logo-tee-girls-adidas-logo.webp";
import facebookMemories from "../../../Assets/Images/Memories.png";
import { useProfileMenu } from "./hooks/useProfileMenu";
import userCircle from "../../../Assets/Images/user-circle-regular-24.png"
import { memo } from "react";

function ProfileMenuComponent(): JSX.Element {
    const { currentUser, getCurrentYear } = useProfileMenu();
    return (
        <div className="bg-gray-100 h-full bg-opacity-85">
            {/* left menu */}
            <ul className="p-4">
                <li className="">
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <img
                            src={currentUser?.photos?.profileImage ? currentUser?.photos?.profileImage : userCircle}
                            className="w-10 h-10 rounded-full"
                            alt="Profile picture"
                        />
                        <span className="font-semibold">
                            {currentUser?.userDetails?.firstName}{" "}
                            {currentUser?.userDetails?.lastName}
                        </span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <img src={facebookFriends} className="w-10 h-10 rounded-full" />
                        <span className="font-semibold">Friends</span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <img src={facebookPages} className="w-10 h-10 rounded-full" />
                        <span className="font-semibold">Pages</span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <img src={facebookMemories} className="w-10 h-10 rounded-full" />
                        <span className="font-semibold">Memories</span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <img src={facebookGroups} className="w-10 h-10 rounded-full" />
                        <span className="font-semibold">Groups</span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <span className="w-10 h-10 rounded-full grid place-items-center  bg-gray-300 dark:bg-dark-second">
                            <i className="bx bxs-chevron-down"></i>
                        </span>
                        <span className="font-semibold">See more</span>
                    </a>
                </li>
                <li className="border-b border-gray-200 dark:border-third mt-6"></li>
            </ul>
            <div className="flex justify-between items-center px-4 h-4 group">
                <span className="font-semibold text-gray-500 text-lg dark:text-dark-txt">
                    Your shortcuts
                </span>
                <span className="text-blue-500 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-third p-2 rounded-md hidden group-hover:inline-block">
                    Edit
                </span>
            </div>
            <ul className="p-4">
                <li>
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <img src={javaScriptLogo} className="w-10 h-10 rounded-full" />
                        <span className="font-semibold">JavaScript</span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <img src={nikeLogo} className="w-10 h-10 rounded-full" />
                        <span className="font-semibold">Nike</span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <img src={KWLogo} className="w-10 h-10 rounded-full" />
                        <span className="font-semibold">keller williams</span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <img src={adidasLogo} className="w-10 h-10 rounded-full" />
                        <span className="font-semibold">Adidas</span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third"
                    >
                        <span className="w-10 h-10 rounded-full grid place-items-center  bg-gray-300 dark:bg-dark-second">
                            <i className="bx bxs-chevron-down"></i>
                        </span>
                        <span className="font-semibold">See more</span>
                    </a>
                </li>
            </ul>
            <div className="mt-auto p-6 text-sm text-gray-500 dark:text-dark-txt">
                <a href="#">Privacy</a>
                <span> . </span>
                <a href="#">Terms</a>
                <span> . </span>
                <a href="#">Advertising</a>
                <span> . </span>
                <a href="#">Cookies</a>
                <span> . </span>
                <a href="#">Ad choices</a>
                <span> . </span>
                <a href="#">More</a>
                <span> . </span>
                <span>Facebook ©️ {getCurrentYear()}</span>
            </div>
            {/* end left menu */}
        </div>
    );
}

export const ProfileMenu = memo(ProfileMenuComponent)
