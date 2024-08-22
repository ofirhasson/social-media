import { createContext, memo, ReactNode, useMemo } from "react";
import { Path, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { useComment } from "../Components/Cards/PostCard/hooks/PostCardPartsHooks/useComment";
import { usePost } from "../Components/Cards/PostCard/hooks/PostCardPartsHooks/usePost";
import { useReply } from "../Components/Cards/PostCard/hooks/PostCardPartsHooks/useReply";
import { CommentModel } from "../Models/CommentModel";
import { LikeModel } from "../Models/LikeModel";
import { PostModel } from "../Models/PostModel";
import { ReplyModel } from "../Models/ReplyModel";
import { UserModel } from "../Models/UserModel";

interface PostContext {
    // post
    isModalOpen: boolean;
    post: PostModel;
    openModalWithAllParts: () => void;
    closeModal: () => void;
    insertLineBreaks: (text: string, maxCharsPerLine: number) => string;
    currentUser: UserModel;
    handleLikePost: () => void;
    // likedPosts: { [key: string]: boolean };
    isLikedPost: boolean;
    postsLikes: Map<string, LikeModel>;

    // comment
    likedComments: Map<string, boolean>;
    handleCommentLikeClick: (commentId: string) => void;
    deleteComment: (comment: CommentModel) => void;
    registerComment: UseFormRegister<CommentModel>;
    registerEditComment: UseFormRegister<CommentModel>;
    handleSubmitComment: UseFormHandleSubmit<CommentModel>;
    handleSubmitEditComment: UseFormHandleSubmit<CommentModel>;
    handleClickDotsButton: (commentId: string) => void;
    openTextareaEditComment: (comment: CommentModel) => void;
    updateComment: (CommentId: string, comment: CommentModel) => void;
    addComment: (comment: CommentModel) => void;
    comments: Map<string, CommentModel>;
    commentsLikes: Map<string, Map<string, LikeModel>>;
    setLikedComments: React.Dispatch<
        React.SetStateAction<Map<string, boolean>>
    >;

    // reply
    openReplyDotes: { [key: string]: boolean };
    likedReplies: Map<string, boolean>;
    openReplyAddField: { [key: string]: boolean };
    registerReply: UseFormRegister<ReplyModel>;
    registerEditReply: UseFormRegister<ReplyModel>;
    handleSubmitReply: UseFormHandleSubmit<ReplyModel>;
    handleSubmitEditReply: UseFormHandleSubmit<ReplyModel>;
    addReply: (commentId: string, reply: ReplyModel) => void;
    updateReply: (commentId: string, replyId: string, reply: ReplyModel) => void;
    openTextAreaEditReply: (reply: ReplyModel) => void;
    handleClickReplyDotsButton: (replyId: string) => void;
    handleReplyLikeClick: (replyId: string) => void;
    deleteReply: (reply: ReplyModel, commentId: string) => void;
    openReplyTextField: (commentId: string) => void;
    registerName?: Path<ReplyModel>;
    replies: Map<string, Map<string, ReplyModel>>;
    repliesLikes: Map<string, Map<string, LikeModel>>;
}

export const PostContext = createContext<PostContext | null>(null);

interface PostProviderProps {
    children: ReactNode;
    post: PostModel;
}

const PostProviderComponent = ({ children, post }: PostProviderProps) => {
    const postFunctions = usePost(post);
    const commentFunctions = useComment(post);
    const replyFunctions = useReply(post);

    const contextValue = useMemo(
        () => ({
            ...postFunctions,
            ...commentFunctions,
            ...replyFunctions,
        }),
        [commentFunctions, replyFunctions, postFunctions]
    );

    return (
        <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>
    );
};

export const PostProvider = memo(PostProviderComponent);
