// import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { UserModel } from "../../Models/UserModel";
// import { PostModel } from "../../Models/PostModel";
// import { CommentModel } from "../../Models/CommentModel";
// import { ReplyModel } from "../../Models/ReplyModel";
// import { LikeModel } from "../../Models/LikeModel";
// import { LikeTarget } from "../../Models/enums";
// import { addComment, deleteComment, updateComment } from "./CommentsSlice";
// import { addReply, deleteReply, updateReply } from "./RepliesSlice";
// import { addLike, removeLike } from "./LikesSlice";

// interface AddCommentPayload {
//   comment: CommentModel;
//   postId: string;
// }

// function initPosts(
//   state: PostModel[],
//   action: PayloadAction<PostModel[]>
// ): PostModel[] {
//   return action.payload || [];
// }

// function createPost(
//   state: PostModel[],
//   action: PayloadAction<PostModel>
// ): PostModel[] {
//   return [...state, action.payload];
// }

// function updatePost(
//   state: PostModel[],
//   action: PayloadAction<PostModel>
// ): PostModel[] {
//   const newState = [...state];
//   const index = newState.findIndex((post) => post._id === action.payload._id);
//   if (index >= 0) {
//     newState[index] = action.payload;
//   }

//   return newState;
// }

// function deletePost(
//   state: PostModel[],
//   action: PayloadAction<string>
// ): PostModel[] {
//   const newState = [...state];
//   const index = newState.findIndex((post) => post._id === action.payload);
//   if (index >= 0) {
//     newState.splice(index, 1);
//   }

//   return newState;
// }

// const postSlice = createSlice({
//   name: "posts",
//   initialState: [] as PostModel[],
//   reducers: {
//     initPosts,
//     createPost,
//     updatePost,
//     deletePost,
//     addComment,
//     updateComment,
//     deleteComment,
//     addReply,
//     updateReply,
//     deleteReply,
//     addLike,
//     removeLike,
//   },
// });

// export const postActionCreators = postSlice.actions;

// export const postReducersContainer = postSlice.reducer;
export class P {

}