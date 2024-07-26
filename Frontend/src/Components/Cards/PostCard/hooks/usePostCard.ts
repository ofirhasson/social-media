import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CommentModel } from "../../../../Models/CommentModel";
import { PostModel } from "../../../../Models/PostModel";
import { ReplyModel } from "../../../../Models/ReplyModel";
import { UserModel } from "../../../../Models/UserModel";
import { useAppSelector } from "../../../../Redux/Store";
import { commentsService } from "../../../../Services/CommentsService";
import { repliesService } from "../../../../Services/RepliesService";
import { notify } from "../../../../Utils/Notify";
import { socketService } from "../../../../Services/SocketService";
import { appConfig } from "../../../../Utils/AppConfig";

export const usePostCard = (post: PostModel) => {
  const [comments, setComments] = useState<CommentModel[]>(()=> post?.comments);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register: registerComment, handleSubmit: handleSubmitComment } =
    useForm<CommentModel>();
   
    const { register: registerEditComment, handleSubmit: handleSubmitEditComment } =
    useForm<CommentModel>();
   
    useEffect(()=>{},[setComments])

  const { register: registerReply, handleSubmit: handleSubmitReply } =
    useForm<ReplyModel>();

  const [commentId, setCommentId] = useState<string | null>(null);

  const [isReply, setIsReply] = useState<{ [key: string]: boolean }>({});
  const [openCommentDotes, setOpenCommentDotes] = useState<{
    [key: string]: boolean;
  }>({});
  const [likedComments, setLikedComments] = useState<{
    [key: string]: boolean;
  }>({});

  const [likedReplies, setLikedReplies] = useState<{
    [key: string]: boolean;
  }>({});




  //   console.log({ isLiked: isLiked });

  const handleCommentLikeClick = (commentId: string) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyLikeClick = (replyId: string) => {
    setLikedReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
  };

  const openReplyTextField = (commentId: string) => {
    setIsReply((prevReply) => ({
      ...prevReply,
      [commentId]: !prevReply[commentId],
    }));

    setCommentId(commentId);
  };

  const handleClickDotsButton = (commentId: string) => {
    console.log({ hello: "hello" });

    setOpenCommentDotes((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  function insertLineBreaks(text: string, maxCharsPerLine: number): string {
    const words = text.split("");
    let lines = [];
    let currentLine = "";

    for (const word of words) {
      if ((currentLine + word).length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = word + "";
      } else {
        currentLine += word + "";
      }
    }
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    return lines.join("\n");
  }

  const userId = useAppSelector((state) => state?.auth?._id);

  const firstName = useAppSelector((state)=> state?.auth?.userDetails?.firstName)
  const lastName = useAppSelector((state)=> state?.auth?.userDetails?.lastName)
  const profileImage = useAppSelector((state)=> state?.auth?.profileImage)
   
  console.log(profileImage);
  
  const profileImages = appConfig.postImageUrl + profileImage

  console.log(profileImages);
  

  const addComment = async (comment: CommentModel): Promise<void> => {
    try {
      comment.targetPostId = post?._id;
      comment.userId = new UserModel();
      comment.userId._id = userId;
      comment.userId.photos.profileImage = profileImages
      comment.userId.userDetails.firstName = firstName
      comment.userId.userDetails.lastName = lastName
      console.log(comment.userId._id);

      if (!comment.text || !comment.targetPostId || !comment.userId) {
        throw new Error("Missing required fields");
      }
    
      console.log(comment);
      await commentsService.addComment(comment);
      setComments((prevComments) => [...prevComments, comment])
      notify.success("Comment has been added");
    } catch (err: any) {
      notify.error(err);
    }
  };




  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  const addReply = async (reply: ReplyModel): Promise<void> => {
    try {
      reply.commentId = commentId;
      reply.userId = new UserModel();
      reply.userId._id = userId;
      await repliesService.addReply(reply);
      notify.success("Reply has been added");
    } catch (err: any) {
      notify.error(err);
    }
  };

  const openModalWithPostAndAllCommentsAndReplies = () => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    // setModalContent(null);
  };

  const [commentBeingEdited, setCommentBeingEdited] = useState<string | null>(
    null
  );
  const [editCommentText, setEditCommentText] = useState<string>("");

  const [openCommentEditField, setOpenCommentEditField] = useState<{[key:string]: boolean}>({})



   const openTextareaEditComment = (commentId:string)=> {
     setOpenCommentEditField((prev) => ({
        ...prev,
        [commentId]:!prev[commentId]
     }))
     setCommentId(commentId)
     setOpenCommentDotes((prev => ({
        ...prev,
        [commentId]:!prev[commentId]
     })))
   }


  // Existing methods...

  const handleEditCommentChange = (text: string) => {
    setEditCommentText(text);
  };

  const updateComment = async (comment: CommentModel): Promise<void> => {
    // Update comment logic (e.g., API call to update comment)
    // Make sure to update the comment in your state and backend
    // Then reset the state
    try {
      comment._id = commentId;
      comment.targetPostId = post._id
      comment.userId = new UserModel();
      comment.userId._id = userId;
      comment.replies = []
      comment.likes = []
      await commentsService.updateComment(comment);
      notify.success("Comment has been updated")
      setCommentBeingEdited(null);
      setEditCommentText("");
    } catch (err: any) {
      notify.error(err);
    }
  };

  return {
    userId,
    isReply,
    likedComments,
    likedReplies,
    openCommentDotes,
    isModalOpen,
    editCommentText,
    commentBeingEdited,
    openReplyTextField,
    openModalWithPostAndAllCommentsAndReplies,
    insertLineBreaks,
    handleSubmitReply,
    addReply,
    registerReply,
    handleSubmitComment,
    addComment,
    registerComment,
    handleClickDotsButton,
    handleCommentLikeClick,
    closeModal,
    handleReplyLikeClick,
    handleEditCommentChange,
    updateComment,
    registerEditComment,
    handleSubmitEditComment,
    openTextareaEditComment,
    openCommentEditField,
    comments,
    firstName,
    lastName,
    profileImage
  };
};
