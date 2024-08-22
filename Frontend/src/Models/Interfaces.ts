import { ReactNode } from "react";
import { CommentModel } from "./CommentModel";
import { PostModel } from "./PostModel";
import { ReplyModel } from "./ReplyModel";

export interface PostCardProps {
    post: PostModel;
}

export interface CommentActionButtonsProps {
    comment: CommentModel;
}

export interface CommentAndReplyUserDetailsProps<T> {
    model: T;
    isComment: boolean;
}

export interface EditReplyInputProps {
    reply: ReplyModel;
    comment: CommentModel;
}

export interface ReplyActionButtonsProps {
    comment: CommentModel;
    reply: ReplyModel;
}

export interface ModalProps {
    component?: ReactNode;
    closeModal: () => void;
    overflow?: string;
}

export type PostModalContentProps = PostCardProps;

export type CommentFooterProps = CommentActionButtonsProps;

export type EditCommentInputProps = CommentActionButtonsProps;

export type RepliesProps = CommentActionButtonsProps;

export type CarouselProps = PostCardProps;
