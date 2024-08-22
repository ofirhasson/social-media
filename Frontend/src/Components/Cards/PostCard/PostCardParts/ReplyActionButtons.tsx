import { memo, useContext, useMemo } from "react";
import dotsImage from "../../../../Assets/Images/dots-horizontal-rounded-regular-24.png";
import { ReplyActionButtonsProps } from "../../../../Models/Interfaces";
import { PostContext } from "../../../../Providers/PostProvider";


function ReplyActionButtonsComponent({
    reply,
    comment,
}: ReplyActionButtonsProps): JSX.Element {
    const postContext = useContext(PostContext);

    const { currentUser,
        handleReplyLikeClick,
        likedReplies,
        handleClickReplyDotsButton,
        openReplyDotes,
        openTextAreaEditReply,
        deleteReply,
        repliesLikes,
    } =
        useMemo(() => {
            return {
                currentUser: postContext.currentUser,
                handleReplyLikeClick: postContext.handleReplyLikeClick,
                likedReplies: postContext.likedReplies,
                handleClickReplyDotsButton: postContext.handleClickReplyDotsButton,
                openReplyDotes: postContext.openReplyDotes,
                openTextAreaEditReply: postContext.openTextAreaEditReply,
                deleteReply: postContext.deleteReply,
                repliesLikes: postContext.repliesLikes,
            };
        }, [postContext]);

    return (
        <>
            <div className="flex justify-end">
                <div className="text-xs flex mr-2">
                    {/* {repliesSize > 0 && ( */}
                    <div className="">
                        <button
                            onClick={() => handleReplyLikeClick(reply._id)}
                            type="button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill={likedReplies.get(reply._id) ? "blue" : ""}
                            >
                                <path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2zM4 10h2v9H4v-9zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7v1.819z"></path>
                            </svg>
                        </button>
                    </div>
                    {/* )} */}
                </div>
                <button className="text-xs mr-1">{repliesLikes.has(reply._id) ? repliesLikes.get(reply._id)?.size : 0} likes</button>
            </div>
            {reply.userId._id === currentUser._id && (
                <div className="absolute text-black p-1 rounded-full top-2 text-xs right-2">
                    <button onClick={() => handleClickReplyDotsButton(reply._id)}>
                        <img src={dotsImage} />
                    </button>
                </div>
            )}
            <hr />

            {openReplyDotes[reply._id] && (
                <div
                    id="dropdown"
                    className="z-10 absolute top-8 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-20 dark:bg-gray-700"
                >
                    <ul
                        className="py-2  text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                    >
                        {reply.userId._id === currentUser._id && (
                            <>
                                <li>
                                    <button
                                        onClick={() => openTextAreaEditReply(reply)}
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        update
                                    </button>
                                </li>

                                <li>
                                    <button
                                        onClick={() => deleteReply(reply, comment._id)}
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Delete
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
}

export const ReplyActionButtons = memo(ReplyActionButtonsComponent)