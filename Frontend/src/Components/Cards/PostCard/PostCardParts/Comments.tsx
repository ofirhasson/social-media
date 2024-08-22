import { memo, useContext, useMemo } from "react";
import { CommentModel } from "../../../../Models/CommentModel";
import { PostContext } from "../../../../Providers/PostProvider";
import { TextFieldMultiline } from "../../../GenericInputs/TextFieldMultiline/TextFieldMultiline";
import { CommentActionButtons } from "./CommentActionButtons";
import { CommentAndReplyUserDetails } from "./CommentAndReplyUserDetails";
import { CommentFooter } from "./CommentFooter";
import { EditCommentInput } from "./EditCommentInput";
import { Replies } from "./Replies";

function CommentsComponent(): JSX.Element {
    const postContext = useContext(PostContext);

    const {
        isModalOpen,
        handleSubmitComment,
        addComment,
        registerComment,
        comments
    } = useMemo(() => {
        return {
            isModalOpen: postContext.isModalOpen,
            // post: postContext.post,
            handleSubmitComment: postContext.handleSubmitComment,
            addComment: postContext.addComment,
            registerComment: postContext.registerComment,
            comments: postContext.comments,
        };
    }, [postContext]);

    const showedComments = isModalOpen ? Array.from(comments?.values() || []) : Array.from(comments?.values() || []).slice(0, 1);

    return (
        <>
            {showedComments?.length >= 1 &&
                showedComments.map((comment) => (
                    <div
                        key={comment?._id}
                        className="mb-3 bg-gray-300 relative border-2 border-black rounded-3xl"
                    >
                        <CommentAndReplyUserDetails<CommentModel>
                            model={comment}
                            key={comment._id}
                            isComment
                        />

                        <div className="ml-20 text-left  text-gray-800 dark:text-gray-100">
                            <div>
                                <EditCommentInput comment={comment} />

                                <Replies comment={comment} />
                            </div>

                            <CommentFooter comment={comment} />
                        </div>

                        <CommentActionButtons comment={comment} />
                    </div>
                ))}

            <TextFieldMultiline<CommentModel>
                label="Comment"
                defaultValue=""
                name="new-comment"
                addButtonName="Add comment"
                classNameDiv="flex m-auto w-full justify-center mt-3 "
                classNameTextField="flex w-100 rounded-full relative pr-20"
                classNameButtonContainer="flex justify-end pt-3 block"
                classNameButton=" bg-blue-600 text-white p-2 rounded-full transform hover:scale-95"
                submit={handleSubmitComment(addComment)}
                register={registerComment}
                registerName={"text"}
            />
        </>
    );
}
export const Comments = memo(CommentsComponent)