import { memo, useContext, useMemo } from "react";
import { PostContext } from "../../../../Providers/PostProvider";
import { Carousel } from "../../../Carousel/Carousel";

function PostCardContentComponent(): JSX.Element {
    const postContext = useContext(PostContext);

    const {
        openModalWithAllParts,
        post,
        handleLikePost,
        comments,
        postsLikes,
        isLikedPost
    } = useMemo(() => {
        return {
            openModalWithAllParts: postContext.openModalWithAllParts,
            post: postContext.post,
            handleLikePost: postContext.handleLikePost,
            isLikedPost: postContext.isLikedPost,
            comments: postContext.comments,
            postsLikes: postContext.postsLikes,
        };
    }, [postContext]);


    return (
        <>
            <p className="text-gray-800 dark:text-gray-100 text-left leading-snug md:leading-normal">
                {post.content}
            </p>
            <div className="mt-4">
                <Carousel post={post} />
            </div>
            <div className="flex justify-between items-center mt-5">
                <div className="flex">
                    <svg
                        className="p-0.5 h-6 w-6 rounded-full z-20 bg-white dark:bg-gray-800 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                    ></svg>
                    <span className="ml-1 flex items-center gap-x-1 text-gray-500 dark:text-gray-400 font-light cursor-pointer ">
                        <i
                            onClick={handleLikePost}
                            className={`bx bx-like text-2xl ${isLikedPost && "text-blue-700"
                                }`}
                        ></i>
                        {postsLikes?.size}
                    </span>
                </div>
                <div
                    className="ml-1 text-gray-500 dark:text-gray-400 font-light cursor-pointer"
                    onClick={openModalWithAllParts}
                >
                    {comments?.size} comments
                </div>
            </div>
            <hr />
            <div onClick={openModalWithAllParts} className="mt-3 text-left">
                <button>
                    {comments?.size > 0 ? "Show more comments" : "No comments"}{" "}
                </button>
            </div>
        </>
    );
}

export const PostCardContent = memo(PostCardContentComponent)