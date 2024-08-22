import { memo, useContext } from "react";
import { CommentFooterProps } from "../../../../Models/Interfaces";
import { PostContext } from "../../../../Providers/PostProvider";

function CommentFooterComponent({ comment }: CommentFooterProps): JSX.Element {
    const { commentsLikes, replies } = useContext(PostContext)

    return (
        <>
            <div className="text-xs">
                <div className="flex justify-end mr-3 pb-2 gap-x-2">
                    <div>
                        <button>{replies.has(comment._id) ? replies.get(comment._id)?.size : 0} replies</button>
                    </div>
                    <div>
                        <button>{commentsLikes.has(comment._id) ? commentsLikes.get(comment._id)?.size : 0} likes </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export const CommentFooter = memo(CommentFooterComponent)
