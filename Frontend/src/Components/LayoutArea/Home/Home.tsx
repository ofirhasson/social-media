import { memo, useState } from "react";
import { PostProvider } from "../../../Providers/PostProvider";
import { PostCard } from "../../Cards/PostCard/PostCard";
import "./Home.css";

import { useForm } from "react-hook-form";
import userCircle from "../../../Assets/Images/user-circle-regular-24.png";
import { PostModel } from "../../../Models/PostModel";
import { useHome } from "./hooks/useHome";
import { StatesProvider } from "../../../Providers/StatesProvider";

function HomeComponent(): JSX.Element {
    const { user, currentUser, posts } = useHome();

    const { register, handleSubmit } = useForm<PostModel>();

    return (
        <div className="mb-10 bg-gray-100 bg-opacity-85 ">
            {/* Main content stories */}
            <div className="w-full lg:w-2/3 xl:w-2/5 xs:w-2/3 pt-32 flex justify-center m-auto  items-center lg:pt-16 px-2 ">
                <div className="relative flex justify-start w-full m-auto space-x-2 pt-4 ">
                    <div className="sm:w-2/8 md:2/6 lg:1/6 h-44 rounded-xl shadow overflow-hidden flex flex-col">
                        <div className="h-3/5 overflow-hidden">
                            <img
                                src={
                                    user?.photos?.profileImage
                                        ? user?.photos?.profileImage
                                        : userCircle
                                }
                                alt="picture"
                                className="group-hover:transform hover:scale-110 h-28 w-full  transition-all duration-700"
                            />
                        </div>
                        <div className="flex-1 relative flex items-end justify-center pb-2 text-center leading-none dark:bg-dark-second dark:text-dark-txt">
                            <span className="font-semibold">
                                Create a <br /> Story
                            </span>
                            <div className="w-10 h-10 rounded-full hover:scale-90 transition-all duration-500 bg-blue-500 text-white grid place-items-center text-2xl border-4 border-white dark:border-dark-second absolute -top-5 left-1/2 transform -translate-x-1/2">
                                <i className="bx bx-plus"></i>
                            </div>
                        </div>
                    </div>

                    {/* other story and my story */}

                    <div className=" sm:w-1/8 xs:w-1/8 xxs:w-2/8 md:w-1/8 h-44 rounded-xl overflow-hidden">
                        <div className="relative w-36 sm:w-1/4 xs:w-full  h-full group cursor-pointer">
                            <img
                                src={
                                    user?.photos?.profileImage
                                        ? user?.photos?.profileImage
                                        : userCircle
                                }
                                alt="picture"
                                className="group-hover:transform hover:scale-110 h-full w-full transition-all duration-700"
                            />
                            <div className="w-full h-full bg-black absolute top-0 left-0 bg-opacity-10"></div>
                            <span className="font-semibold absolute bottom-0 left-0 flex items-center justify-center bg-black w-full pb-2 text-white">
                                Your story
                            </span>
                            <div className="h-10 w-10 rounded-full overflow-hidden absolute top-2 left-1 border-4 border-blue-500">
                                <img
                                    src={
                                        user?.photos?.profileImage
                                            ? user?.photos?.profileImage
                                            : userCircle
                                    }
                                    className="w-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* end other story and my story */}

                    {/* other stories fo friends */}

                    <div className=""></div>
                    <div className=""></div>
                    <div className=""></div>
                    <div className=""></div>
                    <div className=""></div>
                    <div className=""></div>
                    {/* end other stories fo friends */}
                    <div className="w-12 h-12 rounded-full sm:grid  xxs:grid  lg:grid place-items-center text-2xl bg-white absolute -right-6 top-1/2 transform -translate-y-1/2 border-gray-200 cursor-pointer hover:bg-gray-100 shadow text-gray-500 dark:bg-dark-third dark:border-dark-third dark:text-dark-txt">
                        <i className="bx bxs-right-arrow-alt"></i>
                    </div>
                    <div className="w-12 h-12 rounded-full sm:grid  xxs:grid  lg:grid place-items-center text-2xl bg-white absolute -left-16 top-1/2 transform -translate-y-1/2 border-gray-200 cursor-pointer hover:bg-gray-100 shadow text-gray-500 dark:bg-dark-third dark:border-dark-third dark:text-dark-txt">
                        <i className="bx bxs-left-arrow-alt"></i>
                    </div>
                </div>
            </div>
            {/* end Main content stories */}
            {/* post form */}

            <div className="px-4 mt-4 md:w-1/2 maxXs:w-11/12 m-auto shadow rounded-lg bg-white dark:bg-dark-second">
                <div className="flex items-center p-2 border-b border-gray-300 dark:border-dark-third space-x-2">
                    <img
                        src={
                            currentUser?.photos?.profileImage
                                ? currentUser.photos.profileImage
                                : userCircle
                        }
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 bg-gray-100 rounded-full flex items-center justify-start  cursor-pointer dark:bg-dark-third text-gray-500 text-lg dark:text-dark-txt">
                        <span className="w-full h-12 flex items-center text-left pl-2">
                            What's is your mind, {currentUser?.userDetails?.firstName}?
                            {/* <textarea className="w-full border-black border-4 pl-4 max-h-20 rounded-full flex items-center justify-center" placeholder={`What's is your mind, ${currentUser?.userDetails?.firstName}?`}/> */}
                        </span>
                    </div>
                </div>
                <div className="p-2 flex ">
                    <div className="w-1/3 flex space-x=2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xl sm:text-3xl py-2 rounded-lg cursor-pointer text-red-500">
                        <i className="bx bxs-video-plus"></i>
                        <span className="text-xs sm:text-sm font-semibold text-gray-500">
                            Live video
                        </span>
                    </div>
                    <div className="w-1/3 flex space-x=2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xl sm:text-3xl py-2 rounded-lg cursor-pointer text-green-500">
                        <i className="bx bx-images"></i>
                        <span className="text-xs sm:text-sm font-semibold text-gray-500">
                            Live video
                        </span>
                    </div>
                    <div className="w-1/3 flex space-x=2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xl sm:text-3xl py-2 rounded-lg cursor-pointer text-yellow-500">
                        <i className="bx bx-smile"></i>
                        <span className="text-xs sm:text-sm font-semibold text-gray-500">
                            Live video
                        </span>
                    </div>
                </div>
            </div>

            {/* end post form */}

            <div className="pb-10 maxMd:mt-32">
                {Array.from(posts?.values() || []).map((post) => (
                    <StatesProvider key={post._id}>
                        <PostProvider post={post} key={post._id}>
                            <PostCard post={post} key={post._id} />
                        </PostProvider>
                    </StatesProvider>
                ))}
            </div>
        </div>
    );
}

export const Home = memo(HomeComponent);
