import { memo } from "react";
import { PostModalContentProps } from "../../../Models/Interfaces";
import { Comments } from "./PostCardParts/Comments";
import { PostCardContent } from "./PostCardParts/PostCardContent";
import { PostCardHeader } from "./PostCardParts/PostCardHeader";

 function PostModalContentComponent({ post }: PostModalContentProps): JSX.Element {
  return (
    <>
      <div className="px-5 py-4 bg-white justify-center m-auto  dark:bg-gray-800 shadow rounded-lg w-full max-w-lg">
        <PostCardHeader post={post} />
        <PostCardContent />

        <Comments />
      </div>
    </>
  );
}

export const PostModalContent = memo(PostModalContentComponent)
