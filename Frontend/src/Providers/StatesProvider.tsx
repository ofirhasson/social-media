import React, { ReactNode, createContext, memo, useState } from 'react';

interface CommentsContext {
    openCommentEditField: { [key: string]: boolean };
    setOpenCommentEditField: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
    openCommentDotes: { [key: string]: boolean };
    setOpenCommentDotes: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}
interface RepliesContext {
    openReplyEditField: { [key: string]: boolean };
    setOpenReplyEditField: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

interface StatesContext {
    commentsState: CommentsContext;
    repliesState: RepliesContext;
}

export const StatesContext = createContext<StatesContext | null>(null);

const StatesProviderComponent: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [openCommentEditField, setOpenCommentEditField] = useState<{ [key: string]: boolean }>({});
    const [openReplyEditField, setOpenReplyEditField] = useState<{ [key: string]: boolean }>({});
    const [openCommentDotes, setOpenCommentDotes] = useState<{ [key: string]: boolean; }>({});

    const value = {
        commentsState: { openCommentEditField, setOpenCommentEditField, openCommentDotes, setOpenCommentDotes },
        repliesState: { openReplyEditField, setOpenReplyEditField },
    };


    return <StatesContext.Provider value={value}>{children}</StatesContext.Provider>;
};

export const StatesProvider = memo(StatesProviderComponent);
