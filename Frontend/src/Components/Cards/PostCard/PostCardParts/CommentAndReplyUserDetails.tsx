import { memo } from "react";
import userCircle from "../../../../Assets/Images/user-circle-regular-24.png";
import { CommentModel } from "../../../../Models/CommentModel";
import { CommentAndReplyUserDetailsProps } from "../../../../Models/Interfaces";
import { ReplyModel } from "../../../../Models/ReplyModel";

function CommentAndReplyUserDetailsComponent<T extends CommentModel | ReplyModel>({
    model,
    isComment
}: CommentAndReplyUserDetailsProps<T>): JSX.Element {

    return (
        <>
            <div className="flex justify-start w-full items-center">
                <img
                    className={`w-10 mt-1 h-10  rounded-full ${isComment ? "ml-2" : "-ml-12"}`}
                    src={
                        model?.userId?.photos?.profileImage
                            ? model?.userId?.photos?.profileImage
                            : userCircle
                    }
                    alt="User"
                />
                <span className="ml-2 font-medium text-base leading-snug text-black dark:text-gray-100">
                    {model.userId?.userDetails?.firstName +
                        " " +
                        model.userId?.userDetails?.lastName}
                </span>
            </div>
        </>
    );
}
export const CommentAndReplyUserDetails = memo(CommentAndReplyUserDetailsComponent) as typeof CommentAndReplyUserDetailsComponent;