export const getPopulatedSpecialFieldsUserService = [
    {
        path: "likedPosts",
        populate: {
            path: "userId",
            select: "userDetails.firstName userDetails.lastName profileImage",
        },
    },
    {
        path: "posts",
        populate: {
            path: "comments.likes",
            populate: {
                path: "userId",
                select: "userDetails.firstName userDetails.lastName profileImage coverImage",
            },
        },
    },
    {
        path: "posts",
        populate: {
            path: "likes",
            populate: {
                path: "userId",
                select: "userDetails.firstName userDetails.lastName profileImage coverImage",
            },
        },
    },
    {
        path: "posts",
        populate: {
            path: "userId",
            select: "userDetails.firstName userDetails.lastName profileImage coverImage",
        },
    },
    {
        path: "posts",
        populate: {
            path: "comments",
            populate: {
                path: "userId",
                select: "userDetails.firstName userDetails.lastName profileImage coverImage",
            },
        },
    },
    {
        path: "posts",
        populate: {
            path: "comments",
            populate: {
                path: "likes",
                populate: {
                    path: "userId",
                    select: "userDetails.firstName userDetails.lastName profileImage coverImage",
                },
            },
        },
    },
    {
        path: "posts",
        populate: {
            path: "comments",
            populate: {
                path: "replies",
                populate: {
                    path: "userId",
                    select: "userDetails.firstName userDetails.lastName profileImage coverImage",
                },
            },
        },
    },
    {
        path: "posts",
        populate: {
            path: "comments",
            populate: {
                path: "replies",
                populate: {
                    path: "likes",
                    populate: {
                        path: "userId",
                        select: "userDetails.firstName userDetails.lastName profileImage coverImage",
                    },
                },
            },
        },
    },
];
export const specialPopulatedFieldsPostService = [
    {
        path: "likes",
        populate: {
            path: "userId",
            select: "userDetails.firstName userDetails.lastName profileImage coverImage",
        },
    },
    {
        path: "userId",
        select: "userDetails.firstName userDetails.lastName profileImage coverImage",
    },
    {
        path: "comments",
        populate: {
            path: "userId",
            select: "userDetails.firstName userDetails.lastName profileImage coverImage",
        },
    },
    {
        path: "comments",
        populate: {
            path: "likes",
            populate: {
                path: "userId",
                select: "userDetails.firstName userDetails.lastName profileImage coverImage",
            },
        },
    },
    {
        path: "comments",
        populate: {
            path: "replies",
            populate: {
                path: "userId",
                select: "userDetails.firstName userDetails.lastName profileImage coverImage",
            },
        },
    },
    {
        path: "comments",
        populate: {
            path: "replies",
            populate: {
                path: "likes",
                populate: {
                    path: "userId",
                    select: "userDetails.firstName userDetails.lastName profileImage coverImage",
                },
            },
        },
    },
];
export const specialPopulatedFieldsCommentService = [
    {
        path: "replies",
        populate: {
            path: "userId",
            select: "userDetails.firstName userDetails.lastName profileImage coverImage",
        },
    },
    {
        path: "likes",
        populate: {
            path: "userId",
            select: "userDetails.firstName userDetails.lastName profileImage coverImage"
        }
    },
    {
        path: "userId",
        select: "userDetails.firstName userDetails.lastName profileImage coverImage",
    },
];
export const specialPopulatedFieldsReplyService = [
    {
        path: "userId",
        select: "userDetails.firstName userDetails.lastName profileImage coverImage",
    },
    {
        path: "likes",
        populate: {
            path: "userId",
            select: "userDetails.firstName userDetails.lastName profileImage coverImage"
        }
    }
];
export const specialPopulatedFieldsLikeService = [
    {
        path: "userId",
        select: "userDetails.firstName userDetails.lastName profileImage coverImage",
    },
];
