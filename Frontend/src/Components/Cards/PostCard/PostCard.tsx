import { memo, useContext, useMemo } from "react";
import { PostCardProps } from "../../../Models/Interfaces";
import { PostContext } from "../../../Providers/PostProvider";
import { Modal } from "../../ModalArea/Modal/Modal";
import { Comments } from "./PostCardParts/Comments";
import { PostCardContent } from "./PostCardParts/PostCardContent";
import { PostCardHeader } from "./PostCardParts/PostCardHeader";
import { PostModalContent } from "./PostModalContent";



 function PostCardComponent({ post }: PostCardProps): JSX.Element {
  const postContext = useContext(PostContext);

  const { closeModal, isModalOpen } = useMemo(() => {
    return {
      closeModal: postContext.closeModal,
      isModalOpen: postContext.isModalOpen,
    };
  }, [postContext]);

  return (
    <>
      <div className="mt-6 mb-6 dark:bg-gray-900  flex items-center justify-center w-full h-full">
        <div className="px-5 py-4 bg-white xxs:w-4/4 dark:bg-gray-800 shadow rounded-lg w-full max-w-lg">
          <PostCardHeader post={post} />
          <PostCardContent />
          <Comments />
        </div>
      </div>
      {isModalOpen && (
        <Modal
          overflow="overflow-auto"
          component={<PostModalContent post={post} key={post._id} />}
          closeModal={closeModal}
        />
      )}
    </>
  );
}


export const PostCard = memo(PostCardComponent)