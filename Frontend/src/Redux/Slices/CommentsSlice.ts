// import { PayloadAction } from "@reduxjs/toolkit";
// import { PostModel } from "../../Models/PostModel";
// import { CommentModel } from "../../Models/CommentModel";

// export function addComment(
//     state: PostModel[],
//     action: PayloadAction<CommentModel>
//   ): PostModel[] {
//     // If state is not an array, return an empty array
//     if (!Array.isArray(state)) {
//       console.error("State is not an array. Returning empty array.");
//       return [];
//     }
  
//     return state.map((post) => {
//       if (post._id === action.payload.targetPostId) {
//         const updatedPost = {
//           ...post,
//           comments: Array.isArray(post.comments)
//             ? [...post.comments, action.payload]
//             : [action.payload],
//         };
//         return updatedPost;
//       }
//       return post;
//     });
//   }
  
//  export function updateComment(
//     state: PostModel[],
//     action: PayloadAction<CommentModel>
//   ): PostModel[] {
//     // If state is not an array, return an empty array
//     if (!Array.isArray(state)) {
//       console.error("State is not an array. Returning empty array.");
//       return [];
//     }
  
//     return state.map((post) => {
//       if (post._id === action.payload.targetPostId) {
//         const updatedComments = post.comments.map((comment) =>
//           comment._id === action.payload._id ? action.payload : comment
//         );
  
//         return {
//           ...post,
//           comments: updatedComments,
//         };
//       }
//       return post;
//     });
//   }
  
//   export function deleteComment(
//     state: PostModel[],
//     action: PayloadAction<CommentModel>
//   ): PostModel[] {
//     // If state is not an array, return an empty array
//     if (!Array.isArray(state)) {
//       console.error("State is not an array. Returning empty array.");
//       return [];
//     }
  
//     return state.map((post) => {
//       if (post._id === action.payload.targetPostId) {
//         const updatedComments = post.comments.filter(
//           (comment) => comment._id !== action.payload._id
//         );
  
//         return {
//           ...post,
//           comments: updatedComments,
//         };
//       }
//       return post;
//     });
//   }
export class ffff{
    
}
  
  