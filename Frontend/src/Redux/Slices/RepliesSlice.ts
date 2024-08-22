// import { PayloadAction } from "@reduxjs/toolkit";
// import { PostModel } from "../../Models/PostModel";
// import { ReplyModel } from "../../Models/ReplyModel";

// export function addReply(
//     state: PostModel[],
//     action: PayloadAction<ReplyModel>
//   ): PostModel[] {
//     if (!Array.isArray(state)) {
//       console.error("State is not an array. Returning empty array.");
//       return [];
//     }
//     return state.map((post) => {
//       const updatedComments = post.comments.map((comment) => {
//         if (comment._id === action.payload.commentId) {
//           return {
//             ...comment,
//             replies: [...comment.replies, action.payload],
//           };
//         }
  
//         console.log({ comment: comment });
  
//         return comment;
//       });
  
//       return {
//         ...post,
//         comments: updatedComments,
//       };
//     });
//   }
  
//   export function updateReply(
//     state: PostModel[],
//     action: PayloadAction<ReplyModel>
//   ): PostModel[] {
//     if (!Array.isArray(state)) {
//       console.error("State is not an array. Returning empty array.");
//       return [];
//     }
  
//     return state.map((post) => {
//       const updatedComments = post.comments.map((comment) => {
//         if (comment._id === action.payload.commentId) {
//           const updatedReplies = comment.replies.map((reply) =>
//             reply._id === action.payload._id ? action.payload : reply
//           );
  
//           return {
//             ...comment,
//             replies: updatedReplies,
//           };
//         }
//         return comment;
//       });
//       return {
//         ...post,
//         comments: updatedComments,
//       };
//     });
//   }
  
//   export function deleteReply(
//     state: PostModel[],
//     action: PayloadAction<ReplyModel>
//   ): PostModel[] {
//     if (!Array.isArray(state)) {
//       console.error("State is not an array. Returning empty array.");
//       return [];
//     }
  
//     return state.map((post) => {
//       const updatedComments = post.comments.map((comment) => {
//         if (comment._id === action.payload.commentId) {
//           const updatedReplies = comment.replies.filter(
//             (reply) => reply._id !== action.payload._id
//           );
  
//           return {
//             ...comment,
//             replies: updatedReplies,
//           };
//         }
//         return comment;
//       });
//       return {
//         ...post,
//         comments: updatedComments,
//       };
//     });
//   }

export class ff{

}