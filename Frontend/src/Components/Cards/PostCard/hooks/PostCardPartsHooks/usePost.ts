import { useCallback, useMemo, useState } from "react";
import { LikeTarget } from "../../../../../Models/enums";
import { LikeModel } from "../../../../../Models/LikeModel";
import { PostModel } from "../../../../../Models/PostModel";
import { useAppSelector } from "../../../../../Redux/Store";
import { likesService } from "../../../../../Services/LikesService";
import { notify } from "../../../../../Utils/Notify";

export const usePost = (post: PostModel) => {
    const currentUser = useAppSelector((state) => state?.auth);

    // Memoize the `isLikedPost` value to prevent recalculations
    const initialIsLikedPost = useMemo(
        () => post?.likes?.has(currentUser._id),
        [post.likes, post._id, currentUser._id]
    );

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLikedPost, setIsLikedPost] = useState<boolean>(initialIsLikedPost);
    const [postsLikes, setPostsLikes] = useState<Map<string, LikeModel>>(post.likes);

    // Memoize the `openModalWithAllParts` function
    const openModalWithAllParts = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    // Memoize the `closeModal` function
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // Memoize the `insertLineBreaks` function
    const insertLineBreaks = useCallback(
        (text: string, maxCharsPerLine: number): string => {
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
        },
        []
    );

    // Memoize the `addPostLike` function
    const addPostLike = useCallback(async (): Promise<void> => {
        try {
            const like = {
                targetType: LikeTarget.Post,
                targetId: post._id,
                userId: currentUser
            } as LikeModel;
            const likes = await likesService.addLike(like);
            setPostsLikes(likes);
        } catch (err: any) {
            notify.error(err);
        }
    }, [post, currentUser._id, postsLikes]);

    // Memoize the `removePostLike` function
    const removePostLike = useCallback(async (): Promise<void> => {
        try {
            const like = postsLikes.get(currentUser._id);

            if (!like) {
                throw new Error("Like not found");
            }

            const likes = await likesService.removeLike(like);
            setPostsLikes(likes);
        } catch (err: any) {
            notify.error(err);
        }
    }, [post, currentUser._id, isLikedPost]);

    // Memoize the `handleLikePost` function
    const handleLikePost = useCallback(async (): Promise<void> => {
        if (!isLikedPost) {
            await addPostLike();
            setIsLikedPost(true);
        } else {
            await removePostLike();
            setIsLikedPost(false);
        }
    }, [isLikedPost, addPostLike, removePostLike]);

    return useMemo(
        () => ({
            openModalWithAllParts,
            closeModal,
            insertLineBreaks,
            currentUser,
            isModalOpen,
            handleLikePost,
            isLikedPost,
            post,
            postsLikes
        }),
        [
            post,
            openModalWithAllParts,
            closeModal,
            insertLineBreaks,
            currentUser,
            isModalOpen,
            handleLikePost,
            isLikedPost,
            postsLikes
        ]
    );
};
