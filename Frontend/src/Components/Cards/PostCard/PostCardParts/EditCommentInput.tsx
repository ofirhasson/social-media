import { memo, useContext, useEffect, useMemo } from "react";
import { CommentModel } from "../../../../Models/CommentModel";
import { PostContext } from "../../../../Providers/PostProvider";
import { TextFieldMultiline } from "../../../GenericInputs/TextFieldMultiline/TextFieldMultiline";
import { EditCommentInputProps } from "../../../../Models/Interfaces";
import { StatesContext } from "../../../../Providers/StatesProvider";

function EditCommentInputComponent({
    comment,
}: EditCommentInputProps): JSX.Element {

    const postContext = useContext(PostContext);

    const {
        handleSubmitEditComment,
        updateComment,
        registerEditComment,
    } = useMemo(() => {
        return {
            handleSubmitEditComment: postContext.handleSubmitEditComment,
            updateComment: postContext.updateComment,
            registerEditComment: postContext.registerEditComment,
        };
    }, [postContext]);

    const { commentsState } = useContext(StatesContext);
    const { openCommentEditField } = commentsState;

    return (
        <>
            {openCommentEditField[comment._id] ? (
                <div>
                    <TextFieldMultiline<CommentModel>
                        addButtonName="Save"
                        label="Edit Comment"
                        name="edit-comment"
                        defaultValue={comment.text}
                        // onChange={(e: any) => handleEditCommentChange(e.target.value)}
                        classNameDiv="flex m-auto w-full justify-center mt-3 "
                        classNameTextField="flex w-100 rounded-full relative pr-20"
                        classNameButtonContainer="flex justify-end pt-3 block"
                        classNameButton="bg-blue-600 text-white p-2 rounded-full transform hover:scale-95"
                        submit={handleSubmitEditComment((data) => updateComment(comment._id, data))}
                        register={registerEditComment}
                        registerName={"text"}
                    />
                    <hr />
                </div>
            ) : (
                <div className="max-w-full break-all">
                    {/* {insertLineBreaks(comment?.text, 40)} */}
                    {comment?.text}
                    <hr />
                </div>
            )}
        </>
    );
}

export const EditCommentInput = memo(EditCommentInputComponent)
