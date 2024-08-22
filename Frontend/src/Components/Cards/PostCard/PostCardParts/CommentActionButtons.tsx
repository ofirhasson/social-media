import { memo, useContext, useEffect, useMemo } from "react";
import dotsImage from "../../../../Assets/Images/dots-horizontal-rounded-regular-24.png";
import { CommentActionButtonsProps } from "../../../../Models/Interfaces";
import { PostContext } from "../../../../Providers/PostProvider";
import { StatesContext } from "../../../../Providers/StatesProvider";

function CommentActionButtonsComponent({
    comment,
}: CommentActionButtonsProps): JSX.Element {
    const postContext = useContext(PostContext);

    const {
        currentUser,
        handleClickDotsButton,
        handleCommentLikeClick,
        likedComments,
        openReplyTextField,
        openReplyAddField,
        openTextareaEditComment,
        deleteComment,
    } = useMemo(() => {
        return {
            currentUser: postContext.currentUser,
            handleClickDotsButton: postContext.handleClickDotsButton,
            handleCommentLikeClick: postContext.handleCommentLikeClick,
            likedComments: postContext.likedComments,
            openReplyTextField: postContext.openReplyTextField,
            openReplyAddField: postContext.openReplyAddField,
            openTextareaEditComment: postContext.openTextareaEditComment,
            deleteComment: postContext.deleteComment,
        };
    }, [postContext]);

    const { commentsState } = useContext(StatesContext);
    const { openCommentDotes, openCommentEditField } = commentsState;

    return (
        <>
            <div className="absolute right-2 top-1">
                <button
                    onClick={() => handleClickDotsButton(comment._id)}
                    type="button"
                >
                    <img src={dotsImage} alt="dots" />
                </button>
            </div>
            <div className="absolute right-8 top-1">
                <button
                    onClick={() => handleCommentLikeClick(comment._id)}
                    type="button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={likedComments.get(comment._id) ? "blue" : ""}
                    >
                        <path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2zM4 10h2v9H4v-9zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7v1.819z"></path>
                    </svg>
                </button>
            </div>
            {openCommentDotes[comment._id] && (
                <div
                    id="dropdown"
                    className="z-10 absolute top-8 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-20 dark:bg-gray-700"
                >
                    <ul
                        className="py-2  text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                    >
                        <li>
                            <button
                                onClick={() => openReplyTextField(comment._id)}
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                {openReplyAddField[comment._id] ? "Close" : "Reply"}
                            </button>
                        </li>
                        {comment.userId._id === currentUser._id && (
                            <>
                                <li>
                                    <button
                                        onClick={() => openTextareaEditComment(comment)}
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        {openCommentEditField[comment._id] ? "Close" : "Edit"}
                                    </button>
                                </li>

                                <li>
                                    <button
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        onClick={() => {
                                            deleteComment(comment);
                                        }}
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

export const CommentActionButtons = memo(CommentActionButtonsComponent);
