// import { PayloadAction } from "@reduxjs/toolkit";
// import { PostModel } from "../../Models/PostModel";
// import { LikeModel } from "../../Models/LikeModel";
// import { LikeTarget } from "../../Models/enums";

// export function addLike(
//     state: PostModel[],
//     action: PayloadAction<LikeModel>
//   ): PostModel[] {
//     if (action.payload.targetType === LikeTarget.Post) {
//       return state.map((post) => {
//         if (post._id === action.payload.targetId) {
//           return {
//             ...post,
//             likes: [...post.likes, action.payload],
//           };
//         }
//         return {
//           ...post,
//         };
//       });
//     } else if (action.payload.targetType === LikeTarget.Comment) {
//       return state.map((post) => {
//         const updatedComments = post.comments.map((comment) => {
//           if (comment._id === action.payload.targetId) {
//             return {
//               ...comment,
//               likes: [...comment.likes, action.payload],
//             };
//           }
//           return comment;
//         });
  
//         return {
//           ...post,
//           comments: updatedComments,
//         };
//       });
//     } else if (action.payload.targetType === LikeTarget.Reply) {
//       return state.map((post) => {
//         const updatedComments = post.comments.map((comment) => {
//           const updatedReplies = comment.replies.map((reply) => {
//             if (reply._id === action.payload.targetId) {
//               return {
//                 ...reply,
//                 likes: [...reply.likes, action.payload],
//               };
//             }
//             return reply;
//           });
//           return {
//             ...comment,
//             replies: updatedReplies,
//           };
//         });
  
//         return {
//           ...post,
//           comments: updatedComments,
//         };
//       });
//     }
//   }
  
//   export function removeLike(
//     state: PostModel[],
//     action: PayloadAction<LikeModel>
//   ): PostModel[] {
//     if (action.payload.targetType === LikeTarget.Post) {
//       return state.map((post) => {
//         if (post._id === action?.payload?.targetId) {
//           const updatedPostLikes = post?.likes?.filter(
//             (like) => like._id !== action.payload._id
//           );
//           return {
//             ...post,
//             likes: updatedPostLikes,
//           };
//         }
//         return post;
//       });
//     } else if (action.payload.targetType === LikeTarget.Comment) {
//       return state.map((post) => {
//         const updatedComments = post.comments.map((comment) => {
//           if (comment._id === action.payload.targetId) {
//             const updatedCommentLikes = comment.likes.filter(
//               (like) => like._id !== action.payload._id
//             );
//             return {
//               ...comment,
//               likes: updatedCommentLikes,
//             };
//           }
//           return comment;
//         });
  
//         return {
//           ...post,
//           comments: updatedComments,
//         };
//       });
//     } else if (action.payload.targetType === LikeTarget.Reply) {
//       return state.map((post) => {
//         const updatedComments = post.comments.map((comment) => {
//           const updatedReplies = comment.replies.map((reply) => {
//             if (reply._id === action.payload.targetId) {
//               const updatedReplyLikes = reply.likes.filter(
//                 (like) => like._id !== action.payload._id
//               );
//               return {
//                 ...reply,
//                 likes: updatedReplyLikes,
//               };
//             }
//             return reply;
//           });
//           return {
//             ...comment,
//             replies: updatedReplies,
//           };
//         });
  
//         return {
//           ...post,
//           comments: updatedComments,
//         };
//       });
//     }
//   }


export class fdd{
    
}
