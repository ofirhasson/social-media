import { memo, useContext, useMemo } from "react";
import { RepliesProps } from "../../../../Models/Interfaces";
import { ReplyModel } from "../../../../Models/ReplyModel";
import { PostContext } from "../../../../Providers/PostProvider";
import { TextFieldMultiline } from "../../../GenericInputs/TextFieldMultiline/TextFieldMultiline";
import { CommentAndReplyUserDetails } from "./CommentAndReplyUserDetails";
import { EditReplyInput } from "./EditReplyInput";
import { ReplyActionButtons } from "./ReplyActionButtons";

function RepliesComponent({ comment }: RepliesProps): JSX.Element {
    const postContext = useContext(PostContext);
    const { isModalOpen, openReplyAddField, handleSubmitReply, addReply, registerReply, replies, post } =
        useMemo(() => {
            return {
                isModalOpen: postContext.isModalOpen,
                openReplyAddField: postContext.openReplyAddField,
                handleSubmitReply: postContext.handleSubmitReply,
                addReply: postContext.addReply,
                registerReply: postContext.registerReply,
                post: postContext.post,
                replies: postContext.replies,
            };
        }, [postContext]);

    // const { replies } = useReply(post, comment);

    const showedReplies = isModalOpen ? Array.from(replies.get(comment._id)?.values()|| []) : Array.from(replies.get(comment._id)?.values()|| []).slice(0, 1);

    return (
        <>
            <div className={`${isModalOpen ? "" : "relative"}`}>
                {showedReplies?.length >= 1 &&
                    showedReplies?.map((reply) => (
                        <div
                            key={reply?._id}
                            className={`mb-3 w-full ${isModalOpen ? "relative" : ""
                                }  bg-gray-300 `}
                        >
                            <CommentAndReplyUserDetails<ReplyModel>
                                model={reply}
                                key={comment._id}
                                isComment={false}
                            />

                            <EditReplyInput comment={comment} reply={reply} />

                            <ReplyActionButtons comment={comment} reply={reply} />
                        </div>
                    ))}

                {openReplyAddField[comment._id] && (
                    <TextFieldMultiline<ReplyModel>
                        label="Reply"
                        name="new-reply"
                        addButtonName="Add reply"
                        classNameDiv="flex m-auto w-full justify-center mt-3 "
                        classNameTextField="flex w-100 rounded-full relative mr-5 pr-20"
                        classNameButtonContainer="flex justify-end pt-3 block"
                        classNameButton="bg-blue-600 text-white p-2 rounded-full transform hover:scale-95"
                        submit={handleSubmitReply((data) => addReply(comment._id, data))}
                        register={registerReply}
                        registerName={"text"}
                    />
                )}
            </div>
        </>
    );
}

export const Replies = memo(RepliesComponent)