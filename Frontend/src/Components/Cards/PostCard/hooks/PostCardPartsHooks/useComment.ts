import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CommentModel } from "../../../../../Models/CommentModel";
import { LikeModel } from "../../../../../Models/LikeModel";
import { PostModel } from "../../../../../Models/PostModel";
import { LikeTarget } from "../../../../../Models/enums";
import { StatesContext } from "../../../../../Providers/StatesProvider";
import { useAppSelector } from "../../../../../Redux/Store";
import { commentsService } from "../../../../../Services/CommentsService";
import { likesService } from "../../../../../Services/LikesService";
import { appConfig } from "../../../../../Utils/AppConfig";
import { notify } from "../../../../../Utils/Notify";
import { UserModel } from "../../../../../Models/UserModel";

export const useComment = (post: PostModel) => {
    const currentUser = useAppSelector((state) => state?.auth);

    const initialIsLikedComments = useMemo(
        () => {
            const likesObject: Map<string, boolean> = new Map();
            post?.comments?.forEach((comment) => {
                if (comment) {
                    likesObject.set(comment?._id, comment?.likes?.has(currentUser._id));
                }
            })
            return likesObject;
        },
        [post.comments, currentUser._id]
    );

    const initialLikes = useMemo(
        () => {
            const likesObject: Map<string, Map<string, LikeModel>> = new Map();

            post?.comments?.forEach((comment) => {
                if (comment) {
                    likesObject.set(comment?._id, comment?.likes);
                }
            })
            return likesObject;
        },
        [post.comments, currentUser._id]
    );

    const [commentsLikes, setCommentsLikes] = useState<Map<string, Map<string, LikeModel>>>(initialLikes);
    const [likedComments, setLikedComments] = useState<Map<string, boolean>>(initialIsLikedComments);
    const { commentsState, repliesState } = useContext(StatesContext);
    const { openCommentEditField, setOpenCommentEditField, openCommentDotes, setOpenCommentDotes } = commentsState;
    const { setOpenReplyEditField } = repliesState;
    const [comments, setComments] = useState<Map<string, CommentModel>>(post?.comments);

    const {
        register: registerComment,
        handleSubmit: handleSubmitComment,
        setValue: setValueComment,
    } = useForm<CommentModel>();

    const {
        register: registerEditComment,
        handleSubmit: handleSubmitEditComment,
        setValue: setValueEditComment,
    } = useForm<CommentModel>();


    const addComment = useCallback(
        async (comment: CommentModel): Promise<void> => {
            try {

                comment.targetPostId = post?._id;
                comment.userId = {
                    ...currentUser,
                    userDetails: { ...currentUser.userDetails },
                } as UserModel;

                if (comment.userId.profileImage) {
                    comment.userId.profileImage =
                        appConfig.postImageUrl + currentUser.profileImage;
                }

                comment.userId.userDetails.firstName =
                    currentUser?.userDetails?.firstName;
                comment.userId.userDetails.lastName =
                    currentUser?.userDetails?.lastName;

                if (!comment.text || !comment.targetPostId || !comment.userId) {
                    throw new Error("Missing required fields");
                }
                const commentsArr = await commentsService.addComment(comment);

                notify.success("Comment has been added");
                setComments(commentsArr);
                setValueComment("text", "");
            } catch (err: any) {
                notify.error(err);
            }
        },
        [post._id, currentUser._id, setValueComment]
    );

    const deleteComment = useCallback(
        async (comment: CommentModel): Promise<void> => {
            try {
                const commentsArr = await commentsService.deleteComment(comment);
                notify.success("Comment has been deleted");
                setComments(commentsArr);
            } catch (err: any) {
                notify.error(err);
            }
        },
        []
    );;

    const openTextareaEditComment = useCallback(
        (comment: CommentModel) => {
            setValueEditComment("text", comment.text)
            setOpenCommentEditField((prev) => {
                const currentState = prev[comment._id] || false;

                if (currentState) {
                    // If the replyId is already true, set it to false
                    return {
                        ...prev,
                        [comment._id]: false,
                    };
                } else {
                    // Create a new state object with all values set to false
                    const newState = Object.keys(prev).reduce((acc, key) => {
                        acc[key] = false;
                        return acc;
                    }, {} as { [key: string]: boolean });

                    // Set the comment._id to true
                    newState[comment._id] = true;

                    return newState;
                }
            });

            handleClickDotsButton(comment._id);
            setOpenReplyEditField({});

        },
        [openCommentEditField]
    );

    const handleClickDotsButton = useCallback((commentId: string) => {
        setOpenCommentDotes((prev) => {
            // Check if the current state has the commentId
            const currentState = prev[commentId] || false;

            if (currentState) {
                // If the commentId is already true, set it to false
                return {
                    ...prev,
                    [commentId]: false,
                };
            } else {
                // Create a new state object with all values set to false
                const newState = Object.keys(prev).reduce((acc, key) => {
                    acc[key] = false;
                    return acc;
                }, {} as { [key: string]: boolean });

                // Set the commentId to true
                newState[commentId] = true;

                return newState;
            }
        });
    }, []);

    const updateComment = useCallback(
        async (commentId: string, comment: CommentModel): Promise<void> => {
            try {
                comment._id = commentId;
                comment.targetPostId = post._id;
                comment.userId = currentUser;
                if (comment.userId.photos.profileImage) {
                    comment.userId.photos.profileImage =
                        appConfig.postImageUrl + currentUser.profileImage;
                }
                const commentsArr = await commentsService.updateComment(comment);
                notify.success("Comment has been updated");
                setComments(commentsArr);
                setOpenCommentEditField((prev) => ({
                    ...prev,
                    [commentId]: !prev[commentId],
                }));
            } catch (err: any) {
                notify.error(err);
            }
        },
        [post._id, currentUser]
    );

    const addCommentLike = useCallback(
        async (commentId: string): Promise<void> => {
            try {
                const like = {
                    targetType: LikeTarget.Comment,
                    targetId: commentId,
                    userId: currentUser
                } as LikeModel;
                const likes = await likesService.addLike(like);
                setCommentsLikes((prev) => {
                    const updatedCommentsMap = new Map(prev);
                    updatedCommentsMap.set(commentId, likes);
                    return updatedCommentsMap;
                });
            } catch (err: any) {
                notify.error(err);
            }
        },
        [commentsLikes]
    );

    const removeCommentLike = useCallback(
        async (commentId: string): Promise<void> => {
            try {
                const like = commentsLikes.get(commentId)?.get(currentUser._id);

                if (!like) {
                    throw new Error("Like not found");
                }

                const likes = await likesService.removeLike(like);

                setCommentsLikes((prev) => {
                    const updatedCommentsMap = new Map(prev);
                    updatedCommentsMap.set(commentId, likes);
                    return updatedCommentsMap;
                });
            } catch (err: any) {
                notify.error(err);
            }
        },
        [commentsLikes]
    );

    const handleCommentLikeClick = useCallback(
        async (commentId: string): Promise<void> => {
            const isLiked = likedComments.get(commentId);

            if (!isLiked) {
                // setCommentId(commentId)
                await addCommentLike(commentId);
            } else {
                // setCommentId(commentId)
                await removeCommentLike(commentId);
            }

            setLikedComments((prev) => {
                const newLikedComments = new Map(prev); // Clone the previous Map
                newLikedComments.set(commentId, !isLiked); // Update the like status for the specific comment
                return newLikedComments; // Return the updated Map
            });
        },
        [commentsLikes]
    );

    return useMemo(
        () => ({
            handleCommentLikeClick,
            addComment,
            deleteComment,
            openTextareaEditComment,
            handleClickDotsButton,
            updateComment,
            likedComments,
            registerComment,
            handleSubmitComment,
            registerEditComment,
            handleSubmitEditComment,
            openCommentEditField,
            openCommentDotes,
            setOpenCommentEditField,
            setLikedComments,
            comments,
            commentsLikes,
        }),
        [
            handleCommentLikeClick,
            comments,
            addComment,
            deleteComment,
            openTextareaEditComment,
            handleClickDotsButton,
            updateComment,
            likedComments,
            registerComment,
            handleSubmitComment,
            registerEditComment,
            handleSubmitEditComment,
            openCommentEditField,
            openCommentDotes,
            commentsLikes,
        ]
    );
};



