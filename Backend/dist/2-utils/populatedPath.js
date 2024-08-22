"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialPopulatedFieldsLikeService = exports.specialPopulatedFieldsReplyService = exports.specialPopulatedFieldsCommentService = exports.specialPopulatedFieldsPostService = exports.getPopulatedSpecialFieldsUserService = void 0;
exports.getPopulatedSpecialFieldsUserService = [
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
exports.specialPopulatedFieldsPostService = [
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
exports.specialPopulatedFieldsCommentService = [
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
exports.specialPopulatedFieldsReplyService = [
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
exports.specialPopulatedFieldsLikeService = [
    {
        path: "userId",
        select: "userDetails.firstName userDetails.lastName profileImage coverImage",
    },
];
