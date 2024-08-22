import { memo, useContext, useEffect, useMemo } from "react";
import { ReplyModel } from "../../../../Models/ReplyModel";
import { PostContext } from "../../../../Providers/PostProvider";
import { TextFieldMultiline } from "../../../GenericInputs/TextFieldMultiline/TextFieldMultiline";
import { EditReplyInputProps } from "../../../../Models/Interfaces";
import { StatesContext } from "../../../../Providers/StatesProvider";

function EditReplyInputComponent({ reply, comment }: EditReplyInputProps): JSX.Element {
    const postContext = useContext(PostContext);

    const {
        insertLineBreaks,
        handleSubmitEditReply,
        updateReply,
        registerEditReply
    } = useMemo(() => {
        return {
            insertLineBreaks: postContext.insertLineBreaks,
            handleSubmitEditReply: postContext.handleSubmitEditReply,
            updateReply: postContext.updateReply,
            registerEditReply: postContext.registerEditReply,
        };
    }, [postContext]);

    const { repliesState } = useContext(StatesContext);
    const { openReplyEditField } = repliesState;

    return (
        <>
            {openReplyEditField[reply._id] ? (
                <TextFieldMultiline<ReplyModel>
                    label="Reply"
                    name="update-reply"
                    // defaultValue={reply.text}
                    addButtonName="Save"
                    classNameDiv="flex m-auto w-full justify-center mt-3"
                    classNameTextField="flex w-100 rounded-full relative mr-5 pr-20"
                    classNameButtonContainer="flex justify-end pt-3 block"
                    classNameButton=" bg-blue-600 text-white p-2 rounded-full transform hover:scale-95"
                    registerName={"text"}
                    submit={handleSubmitEditReply((data) => updateReply(comment._id, reply._id, data))}
                    register={registerEditReply}
                />
            ) : (
                <div>{insertLineBreaks(reply.text, 40)}</div>
            )}
        </>
    );
}

export const EditReplyInput = memo(EditReplyInputComponent)