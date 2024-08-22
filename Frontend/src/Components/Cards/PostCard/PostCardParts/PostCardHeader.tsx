import { memo } from "react";
import { PostCardProps } from "../../../../Models/Interfaces";
import userCircle from "../../../../Assets/Images/user-circle-regular-24.png"


function PostCardHeaderComponent({ post }: PostCardProps): JSX.Element {

    return (
        <>
            <div className="flex mb-4">
                <img
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                    src={post?.userId?.photos?.profileImage ? post?.userId?.photos?.profileImage : userCircle}
                    alt="User"
                />
                <div className="ml-2 mt-0.5">
                    <span className="block font-medium text-base leading-snug text-black dark:text-gray-100">
                        {post?.userId?.userDetails?.firstName +
                            " " +
                            post?.userId?.userDetails?.lastName}
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-gray-400 font-light leading-snug">
                        {post?.created?.substring(0, 10)}&nbsp;
                        {post?.created?.substring(11, 16)}
                    </span>
                </div>
            </div>
        </>
    );
}


export const PostCardHeader = memo(PostCardHeaderComponent)