import { CommentModel } from "../../../Models/CommentModel";
import { PostModel } from "../../../Models/PostModel";
import { Carousel } from "../../Carousel/Carousel";
import { TextFieldMultiline } from "../../GenericInputs/TextFieldMultiline/TextFieldMultiline";
import userCircle from "../../../Assets/Images/user-circle-regular-24.png";
import dotsImage from "../../../Assets/Images/dots-horizontal-rounded-regular-24.png";
import { ReplyModel } from "../../../Models/ReplyModel";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { useEffect, useState } from "react";

interface PostModalContent {
  post: PostModel;
  insertLineBreaks: (text: string, maxCharsPerLine: number) => string;
  userId: string;
  isReply: { [key: string]: boolean };
  handleSubmitReply: UseFormHandleSubmit<ReplyModel>;
  addReply: (reply: ReplyModel) => void;
  registerReply: UseFormRegister<ReplyModel>;
  registerReplyName: keyof ReplyModel;
  handleClickDotsButton: (commentId: string) => void;
  handleCommentLikeClick: (commentId: string) => void;
  likedComments: { [key: string]: boolean };
  openCommentDotes: { [key: string]: boolean };
  openReplyTextField: (commentId: string) => void;
  handleSubmitComment: UseFormHandleSubmit<CommentModel>;
  addComment: (comment: CommentModel) => void;
  registerComment: UseFormRegister<CommentModel>;
  registerCommentName:keyof CommentModel;
  handleReplyLikeClick: (replyId:string)=>void;
  likedReplies: {[key:string]: boolean};
  openCommentEditField:{[key:string]:boolean}
  handleEditCommentChange:(event: React.ChangeEvent<HTMLTextAreaElement>)=>void
  handleSubmitEditComment: UseFormHandleSubmit<CommentModel>
  updateComment: (comment:CommentModel) =>void
  registerEditComment:UseFormRegister<CommentModel>
  openTextareaEditComment: (commentId:string) =>void
  postComments:CommentModel[]

}

export function PostModalContent({
  post,
  insertLineBreaks,
  userId,
  isReply,
  likedComments,
  openCommentDotes,
  registerReplyName,
  registerCommentName,
  likedReplies,
  openCommentEditField,
  addReply,
  handleSubmitReply,
  registerReply,
  handleClickDotsButton,
  handleCommentLikeClick,
  openReplyTextField,
  addComment,
  handleSubmitComment,
  registerComment,
  handleReplyLikeClick,
  handleEditCommentChange,
  handleSubmitEditComment,
  updateComment,
  registerEditComment,
  openTextareaEditComment,
  postComments,

}: PostModalContent): JSX.Element {



  return (
    <>
      <div className="px-5 py-4 bg-white justify-center m-auto  dark:bg-gray-800 shadow rounded-lg w-full max-w-lg">
        <div key={post._id} className="flex  mb-4">
          <img
            className="w-10 h-10 md:w-12 md:h-12 rounded-full"
            src={post?.userId?.photos?.profileImage}
            alt="User"
          />
          <div className="ml-2 mt-0.5">
            <span className="block font-medium text-base leading-snug text-black dark:text-gray-100">
              {post?.userId?.userDetails?.firstName +
                " " +
                post?.userId?.userDetails?.lastName}
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400 font-light leading-snug">
              {post.created.substring(0, 10)}&nbsp;
              {post.created.substring(11, 16)}
            </span>
          </div>
        </div>
        <p className="text-gray-800 dark:text-gray-100 text-left leading-snug md:leading-normal">
          {post.content}
        </p>
        <div className="mt-4">
          <Carousel post={post} />
        </div>
        <div className="flex justify-between items-center mt-5">
          <div className="flex">
            <svg
              className="p-0.5 h-6 w-6 rounded-full z-20 bg-white dark:bg-gray-800 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              //   onClick={openModalWithLikes}
            >
              {/* SVG path here */}
            </svg>
            <span className="ml-1 flex gap-x-1 text-gray-500 dark:text-gray-400 font-light">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2zM20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2z"></path>
              </svg>{" "}
              {post?.likes?.length}
            </span>
          </div>
          <div
            className="ml-1 text-gray-500 dark:text-gray-400 font-light cursor-pointer"
          >
            {postComments?.length} comments
          </div>
        </div>
        <hr />
        <div
          className="mt-3 text-left"
        >
          <button>
            {post?.comments?.length > 0 ? "Show more comments" : "No comments"}{" "}
          </button>
        </div>
        {postComments?.map((comment) => (
          <div
            key={comment?._id}
            className="mb-3 bg-gray-300 relative border-2 border-black rounded-3xl"
          >
            <div className="flex items-center">
              <img
                className="w-10 mt-1 h-10 ml-3 rounded-full"
                src={
                  comment?.userId.photos?.profileImage
                    ? comment?.userId.photos?.profileImage
                    : userCircle
                }
                alt="User"
              />
              <span className="ml-2 font-medium text-base leading-snug text-black dark:text-gray-100">
                {comment?.userId?.userDetails?.firstName +
                  " " +
                  comment?.userId?.userDetails?.lastName}
              </span>
            </div>
            <div className="ml-20 text-left  text-gray-800 dark:text-gray-100">
            <div>
                  {openCommentEditField[comment?._id] ? (
                    <div key={comment._id}>
                    <TextFieldMultiline<CommentModel>  
                      addButtonName="Save"
                      label="Edit Comment"
                      name="edit-comment"
                      onChange={(e: any) =>
                        handleEditCommentChange(e.target.value)
                      }
                      classNameDiv="flex m-auto w-full justify-center mt-3 "
                      classNameTextField="flex w-100 rounded-full relative pr-20"
                      classNameButtonContainer="flex justify-end pt-3 block"
                      classNameButton="bg-blue-600 text-white p-2 rounded-full transform hover:scale-95"
                      submit={handleSubmitEditComment(updateComment)}
                      register={registerEditComment}
                      registerName="text"
                    />
                    <hr/>
                    </div>
                  ) : (
                    <div>
                      {insertLineBreaks(comment?.text, 40)}
                      <hr />
                    </div>
                  )}
                <div className="">
                  {comment?.replies?.map((reply) => (
                    <div
                      key={reply?._id}
                      className="mb-3 w-full bg-gray-300 relative"
                    >
                      <div className="flex  items-center">
                        <img
                          className="w-10 mt-1 h-10 -ml-16 rounded-full"
                          src={
                            reply.userId.photos?.profileImage
                              ? reply.userId.photos?.profileImage
                              : userCircle
                          }
                          alt="User"
                        />
                        <span className="ml-2 font-medium text-base leading-snug text-black dark:text-gray-100">
                          {reply.userId.userDetails?.firstName +
                            " " +
                            reply.userId.userDetails?.lastName}
                        </span>
                      </div>
                      <div>{reply?.text}</div>
                      <div className="flex justify-end">
                          <div className="text-xs flex mr-2">
                            {comment.replies?.length > 0 && (
                              <div className="">
                                <button
                                  onClick={() =>
                                    handleReplyLikeClick(reply._id)
                                  }
                                  type="button"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill={likedReplies[reply._id] ? "blue" : ""}
                                  >
                                    <path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2zM4 10h2v9H4v-9zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7v1.819z"></path>
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                          <button className="text-xs mr-1">
                            {reply?.likes?.length} likes
                          </button>
                        </div>
                      {reply.userId._id === userId && (
                        <div className="absolute bg-white text-black p-1 rounded-full top-2 text-xs right-2">
                          <button>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z"></path>
                            </svg>
                          </button>
                        </div>
                      )}
                      <hr />
                    </div>
                  ))}
                  {isReply[comment._id] && (
                    <TextFieldMultiline<ReplyModel>
                      label="Reply"
                      name="new-reply"
                      addButtonName="Add reply"
                      classNameDiv="flex m-auto w-full justify-center  mt-3 "
                      classNameTextField="flex w-100 rounded-full relative mr-5 pr-20"
                      classNameButtonContainer="flex justify-end pt-3 block"
                      classNameButton=" bg-blue-600 text-white p-2 rounded-full transform hover:scale-95"
                      submit={handleSubmitReply(addReply)}
                      register={registerReply}
                      registerName={registerReplyName}
                    />
                  )}
                </div>
              </div>

              <div className="text-xs">
                <div className="flex justify-end mr-3 pb-2 gap-x-2">
                  <div>
                    <button>{comment?.replies?.length} replies</button>
                  </div>
                  <div>
                    <button>{comment?.likes?.length} likes </button>
                  </div>
                </div>
              </div>
            </div>

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
                  fill={likedComments[comment._id] ? "blue" : ""}
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
                      Reply
                    </button>
                  </li>
                  {comment.userId._id === userId && (
                    <li>
                      <button onClick={()=> openTextareaEditComment(comment._id)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      {openCommentEditField[comment._id] ? "Close" :"Edit"}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
        <TextFieldMultiline<CommentModel>
          label="Comment"
          name="new-comment"
          addButtonName="Add comment"
          classNameDiv="flex m-auto w-full justify-center mt-3 "
          classNameTextField="flex w-100 rounded-full relative pr-20"
          classNameButtonContainer="flex justify-end pt-3 block"
          classNameButton=" bg-blue-600 text-white p-2 rounded-full transform hover:scale-95"
          submit={handleSubmitComment(addComment)}
          register={registerComment}
          registerName={registerCommentName}
        />
      </div>
    </>
  );
}
