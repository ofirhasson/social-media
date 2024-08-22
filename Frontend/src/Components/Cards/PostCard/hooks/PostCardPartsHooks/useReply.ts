import { useCallback, useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { LikeModel } from "../../../../../Models/LikeModel";
import { PostModel } from "../../../../../Models/PostModel";
import { ReplyModel } from "../../../../../Models/ReplyModel";
import { LikeTarget } from "../../../../../Models/enums";
import { StatesContext } from "../../../../../Providers/StatesProvider";
import { useAppSelector } from "../../../../../Redux/Store";
import { likesService } from "../../../../../Services/LikesService";
import { repliesService } from "../../../../../Services/RepliesService";
import { appConfig } from "../../../../../Utils/AppConfig";
import { notify } from "../../../../../Utils/Notify";
import { useComment } from "./useComment";
import { UserModel } from "../../../../../Models/UserModel";

export const useReply = (post: PostModel) => {
    const { comments } = useComment(post);

    const currentUser = useAppSelector((state) => state?.auth);

    const initialReplies = useMemo(
        () => {
            const repliesObject: Map<string, Map<string, ReplyModel>> = new Map();
            post?.comments?.forEach((comment) => {
                if (comment) {
                    repliesObject.set(comment?._id, comment?.replies);
                }
            })
            return repliesObject;
        },
        [comments, currentUser._id]
    );

    const initialIsLikedReplies = useMemo(
        () => {
            const allReplies: ReplyModel[] = [];

            // Iterate through the comments Map
            post.comments?.forEach(comment => {
                // Spread replies Map values into an array and add to allReplies array
                comment.replies?.forEach(reply => allReplies.push(reply));
            });

            const isLikedReplies: Map<string, boolean> = new Map();
            allReplies.forEach((reply) => {
                if (reply && reply?._id) {
                    isLikedReplies.set(reply._id, reply.likes.has(currentUser._id));
                }
            })
            return isLikedReplies;
        },
        [currentUser._id]
    );
    const initialRepliesLikes = useMemo(() => {
        const repliesObject: Map<string, Map<string, LikeModel>> = new Map();

        comments?.forEach((comment) => {
            comment?.replies?.forEach(reply => {
                repliesObject.set(reply._id, reply.likes);
            });
        });

        return repliesObject;
    }, [post]);

    const [repliesLikes, setRepliesLikes] = useState<Map<string, Map<string, LikeModel>>>(initialRepliesLikes);
    const [replies, setReplies] = useState<Map<string, Map<string, ReplyModel>>>(initialReplies);
    const [openReplyAddField, setOpenReplyAddField] = useState<{ [key: string]: boolean }>({});
    const [likedReplies, setLikedReplies] = useState<Map<string, boolean>>(initialIsLikedReplies);
    const [openReplyDotes, setOpenReplyDotes] = useState<{ [key: string]: boolean }>({});

    const { commentsState, repliesState } = useContext(StatesContext);
    const { setOpenCommentEditField, setOpenCommentDotes } = commentsState;
    const { openReplyEditField, setOpenReplyEditField } = repliesState;

    const {
        register: registerEditReply,
        handleSubmit: handleSubmitEditReply,
        setValue: setValueEditReply,
    } = useForm<ReplyModel>();

    const {
        register: registerReply,
        handleSubmit: handleSubmitReply,
        setValue: setValueReply,
    } = useForm<ReplyModel>();

    const addReply = useCallback(
        async (commentId: string, reply: ReplyModel): Promise<void> => {
            try {
                reply.commentId = commentId;
                reply.userId = {
                    ...currentUser,
                    userDetails: { ...currentUser.userDetails },
                } as UserModel;
                if (reply.userId.profileImage) {
                    reply.userId.profileImage =
                        appConfig.postImageUrl + currentUser.profileImage;
                }
                const repliesArr = await repliesService.addReply(reply);
                notify.success("Reply has been added");
                setOpenReplyAddField((prevReply) => ({
                    ...prevReply,
                    [commentId]: !prevReply[commentId],
                }));
                setReplies((prev) => {
                    const repliesMap = new Map(prev);
                    repliesMap.set(commentId, repliesArr);
                    return repliesMap
                });
                setValueReply("text", "");
            } catch (err: any) {
                notify.error(err);
            }
        },
        [currentUser, setValueReply]
    );

    const updateReply = useCallback(
        async (commentId: string, replyId: string, reply: ReplyModel): Promise<void> => {
            try {
                reply._id = replyId;
                reply.userId = currentUser;
                reply.commentId = commentId;
                if (reply.userId.profileImage) {
                    reply.userId.profileImage =
                        appConfig.postImageUrl + currentUser.profileImage;
                }
                const repliesArr = await repliesService.updateReply(reply);
                notify.success("Reply has been updated");
                setOpenReplyEditField((prev) => ({
                    ...prev,
                    [reply._id]: !prev[reply._id],
                }));
                setReplies((prev) => {
                    const repliesMap = new Map(prev);
                    repliesMap.set(commentId, repliesArr);
                    return repliesMap
                });
            } catch (err: any) {
                notify.error(err);
            }
        },
        [currentUser]
    );

    const openTextAreaEditReply = useCallback(
        (reply: ReplyModel) => {
            setValueEditReply("text", reply.text);
            setOpenReplyEditField((prev) => {
                const currentState = prev[reply._id] || false;

                if (currentState) {
                    // If the replyId is already true, set it to false
                    return {
                        ...prev,
                        [reply._id]: false,
                    };
                } else {
                    // Create a new state object with all values set to false
                    const newState = Object.keys(prev).reduce((acc, key) => {
                        acc[key] = false;
                        return acc;
                    }, {} as { [key: string]: boolean });

                    // Set the reply._id to true
                    newState[reply._id] = true;

                    return newState;
                }
            });

            handleClickReplyDotsButton(reply._id);
            setOpenCommentEditField({});

        },
        [openReplyEditField]
    );

    const openReplyTextField = useCallback(
        (commentId: string) => {
            setOpenReplyAddField((prevReply) => ({
                ...prevReply,
                [commentId]: !prevReply[commentId],
            }));
            setOpenCommentDotes({});
        },
        []
    );

    const handleClickReplyDotsButton = useCallback(
        (replyId: string) => {
            setOpenReplyDotes((prev) => {
                // Check if the current state has the replyId
                const currentState = prev[replyId] || false;

                if (currentState) {
                    // If the replyId is already true, set it to false
                    return {
                        ...prev,
                        [replyId]: false,
                    };
                } else {
                    // Create a new state object with all values set to false
                    const newState = Object.keys(prev).reduce((acc, key) => {
                        acc[key] = false;
                        return acc;
                    }, {} as { [key: string]: boolean });

                    // Set the replyId to true
                    newState[replyId] = true;

                    return newState;
                }
            });


        },
        [post._id]
    );

    const deleteReply = useCallback(async (reply: ReplyModel, commentId: string): Promise<void> => {
        try {
            const repliesArr = await repliesService.deleteReply(reply);
            setReplies((prev) => {
                const repliesMap = new Map(prev);
                repliesMap.set(commentId, repliesArr);
                return repliesMap
            });
            notify.success("Reply has been deleted");
        } catch (err: any) {
            notify.error(err);
        }
    }, []);

    const addReplyLike = useCallback(
        async (replyId: string): Promise<void> => {
            try {
                const like = {
                    targetType: LikeTarget.Reply,
                    targetId: replyId,
                    userId: currentUser
                } as LikeModel;

                const likes = await likesService.addLike(like);
                setRepliesLikes((prev) => {
                    const replyLikes = new Map(prev);
                    replyLikes.set(replyId, likes);
                    return replyLikes;
                });
            } catch (err: any) {
                notify.error(err);
            }
        },
        [repliesLikes]
    );

    const removeReplyLike = useCallback(
        async (replyId: string): Promise<void> => {
            try {
                const like = repliesLikes.get(replyId).get(currentUser._id);

                if (like) {
                    const likes = await likesService.removeLike(like);

                    setRepliesLikes((prev) => {
                        const replyLikes = new Map(prev);
                        replyLikes.set(replyId, likes);
                        return replyLikes;
                    });
                }
            } catch (err: any) {
                notify.error(err);
            }
        },
        [repliesLikes]
    );

    const handleReplyLikeClick = useCallback(
        async (replyId: string): Promise<void> => {

            const isLiked = likedReplies.get(replyId);

            !isLiked
                ? await addReplyLike(replyId)
                : await removeReplyLike(replyId);

            setLikedReplies((prev) => {
                const updatedRepliesMap = new Map(prev);
                updatedRepliesMap.set(replyId, !isLiked);
                return updatedRepliesMap;
            });
        },
        [likedReplies, addReplyLike, removeReplyLike]
    );

    return useMemo(
        () => ({
            addReply,
            updateReply,
            openTextAreaEditReply,
            openReplyTextField,
            handleClickReplyDotsButton,
            handleReplyLikeClick,
            deleteReply,
            registerEditReply,
            handleSubmitEditReply,
            openReplyAddField,
            likedReplies,
            registerReply,
            handleSubmitReply,
            openReplyEditField,
            openReplyDotes,
            replies,
            repliesLikes,
        }),
        [
            addReply,
            updateReply,
            openTextAreaEditReply,
            openReplyTextField,
            handleClickReplyDotsButton,
            handleReplyLikeClick,
            deleteReply,
            registerEditReply,
            handleSubmitEditReply,
            openReplyAddField,
            likedReplies,
            registerReply,
            handleSubmitReply,
            openReplyEditField,
            openReplyDotes,
            replies,
            repliesLikes,
        ]
    );
};
