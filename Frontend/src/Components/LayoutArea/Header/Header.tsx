import "./Header.css";

import facebookLogo from "../../../Assets/Images/Facebook_Logo_2023.png";
import facebookLogoMd from "../../../Assets/Images/FacebookLogo.png";
import { useAppSelector } from "../../../Redux/Store";
import { useAppSelectors } from "../../hooks/AppSelectors/useAppSelectors";
import { memo } from "react";

 function HeaderComponent(): JSX.Element {
const {user} = useAppSelectors()
  return (
    <div className="h-16 bg-gray-100 dark:bg-dark-main w-full">
      {/* Nav */}
      <nav className="bg-white dark:bg-dark-second lg:h-17 md:h-17 w-full flex flex-col md:flex-row items-center justify-center md:justify-between fixed top-0 z-50 border-b dark:border-dark-third">
        {/* left nav */}
        <div className="flex items-center justify-between w-full md:w-max px-4 py-2">
          <a href="#" className="mr-2 hidden md:inline-block">
            <img
              className="md:w-17 md:mr-6 sm:w-17 lg:w-17 h-10"
              src={facebookLogo}
              alt="Facebook logo"
            />
          </a>
          <a href="#" className="inline-block md:hidden">
            <img src={facebookLogoMd} className="w-32 h-auto" />
          </a>
          <div className="flex items-center justify-between space-x-1">
            <div className="relative bg-gray-100 dark:bg-dark-third px-2 py-2 w-10 h-10 sm:h-11 sm:w-11 lg:w-10 lg:h-10 xl:w-max xl:pl-3 xl:pr-8 rounded-full flex items-center justify-center cursor-pointer">
              <i className="bx bx-search-alt-2 text-xl xl:mr-2 dark:text-dark-txt"></i>
              <input
                type="text"
                placeholder="Search facebook"
                className="outline-none bg-transparent hidden xl:inline-block"
              />
            </div>
            <div className="text-2xl grid place-items-center md:hidden bg-gray-200 dark:bg-dark-third rounded-full w-10 h-10 cursor-pointer hover:bg-gray=300 dark-text-dark-txt">
              <i className="bx bxl-messenger"></i>
            </div>
            <div className="text-2xl grid place-items-center md:hidden bg-gray-200 dark:bg-dark-third rounded-full w-10 h-10 cursor-pointer hover:bg-gray=300 dark-text-dark-txt">
              <i className="bx bxs-moon"></i>
            </div>
          </div>
        </div>
        {/* end left nav */}

        {/* ///////////////////////////////////////// */}

        {/* main nav */}
        <ul className="flex gap-x-10 xxs:gap-x-5  items-center justify-center lg:justify-between">
          <li className="w-1/5 md:w-max text-center">
            <a
              href="#"
              className="w-full text-3xl py-2 px-2 xl:px-12 cursor-pointer text-center inline-block text-blue-500 border-b-4 border-blue-500"
            >
              <i className="bx bxs-home"></i>
            </a>
          </li>
          <li className="w-1/5 md:w-max text-center">
            <a
              href="#"
              className="w-full text-3xl py-2 px-2 xl:px-12 cursor-pointer text-center inline-block rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-third dark:text-dark-txt relative"
            >
              <i className="bx bx-movie-play"></i>
              <span className="text-xs absolute top-0 right-1/4 md:right-0 bg-red-500 text-white font-semibold rounded-full px-1 text-center">
                9+
              </span>
            </a>
          </li>
          <li className="w-1/5 md:w-max text-center">
            <a
              href="#"
              className="w-full text-3xl py-2 px-2 xl:px-12 cursor-pointer text-center inline-block rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-third dark:text-dark-txt relative"
            >
              <i className="bx bx-store"></i>
            </a>
          </li>
          <li className="w-1/5 md:w-max text-center">
            <a
              href="#"
              className="w-full text-3xl py-2 px-2 xl:px-12 cursor-pointer text-center inline-block rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-third dark:text-dark-txt relative"
            >
              <i className="bx bx-group"></i>
            </a>
          </li>
          <li className="w-1/5 md:w-max text-center hidden md:inline-block">
            <a
              href="#"
              className="w-full text-3xl py-2 px-2 xl:px-12 cursor-pointer text-center inline-block rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-third dark:text-dark-txt relative"
            >
              <i className="bx bx-layout"></i>
              <span className="text-xs absolute top-0 right-1/4 md:right-0 bg-red-500 text-white font-semibold rounded-full px-1 text-center">
                9+
              </span>
            </a>
          </li>
          <li className="w-1/5 md:w-max text-center inline-block md:hidden">
            <a
              href="#"
              className="w-full text-3xl py-2 px-2 xl:px-12 cursor-pointer text-center inline-block rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-third dark:text-dark-txt relative"
            >
            <i className='bx bx-menu' ></i>
             
            </a>
          </li>
        </ul>
        {/* end main nav */}

        {/* /////////////////////////////////////// */}

        {/* right nav */}

        <ul className="hidden md:flex mx-4 items-center justify-center">
          <li className="h-full hidden xl:flex">
            <a
              href="#"
              className="inline-flex items-center justify-center p-1 rounded-full hover:bg-gary-200 dark:bg-dark-third mx-1"
            >
              <img
                className="h-10 w-10 rounded-full"
                src={user?.photos?.profileImage}
              />
              <span className="mx-2 font-semibold dark:text-dark-txt">
                {user?.userDetails?.firstName}{" "}
                {user?.userDetails?.lastName}{" "}
              </span>
            </a>
          </li>
          <li>
            <div className="text-xl hidden xl:grid place-items-center bg-gray-200 dark:bg-dark-third dark:text-dark-txt rounded-full mx-1 p-2 cursor-pointer hover:bg-gray-300 relative">
              <i className="bx bx-plus"></i>
            </div>
          </li>
          <li>
            <div className="text-xl hidden xl:grid place-items-center bg-gray-200 dark:bg-dark-third dark:text-dark-txt rounded-full mx-1 p-2  cursor-pointer hover:bg-gray-300 relative">
              <i className="bx bxl-messenger"></i>
            </div>
          </li>
          <li>
            <div className="text-xl xl:grid place-items-center bg-gray-200 dark:bg-dark-third dark:text-dark-txt rounded-full mx-1 p-2 cursor-pointer hover:bg-gray-300 relative">
              <i className="bx bxs-bell"></i>
              <span className="text-xs absolute top-0 right-0 bg-red-500 text-white font-semibold rounded-full px-1 text-center">
                9
              </span>
            </div>
          </li>
          <li>
            <div className="text-xl xl:grid place-items-center bg-gray-200 dark:bg-dark-third dark:text-dark-txt rounded-full mx-1 p-2 cursor-pointer hover:bg-gray-300 relative">
              <i className="bx bxs-moon"></i>
            </div>
          </li>
        </ul>

        {/* end right nav */}
      </nav>
      {/* end nav */}
    </div>
  );
}


export const Header = memo(HeaderComponent)