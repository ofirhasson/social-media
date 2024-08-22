import { configureStore } from "@reduxjs/toolkit";
import { authReducersContainer } from "./Slices/AuthSlice";
// import { userReducersContainer } from "./Slices/UsersSlice";
// import { postReducersContainer } from "./Slices/PostsSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { AppState } from "./AppState";
// import { commentReducersContainer } from "./CommentsSlice";

// This line initializes the Redux store using the configureStore function, which is provided by the Redux Toolkit.
export const appStore = configureStore({
  // The `reducer` key specifies the root reducer for the Redux store. It combines multiple reducers into a single reducer function.
  reducer: {
    // auth is a slice of the state managed by the `authReducersContainer` reducer.
    auth: authReducersContainer,

    // user is a slice of the state managed by the `userReducersContainer` reducer.
    // users: userReducersContainer,

    // posts: postReducersContainer,

 
  },
});

// export type AppDispatch = typeof appStore.dispatch;

// const selectPosts = (state: AppState) => state.posts;

// export const selectPostById = createSelector(
//     [selectPosts, (state, postId) => postId],
//     (posts, postId) => posts.find(post => post._id === postId)
// );

// export const selectCommentsByPostId = createSelector(
//     [selectPostById],
//     (post) => post ? post.comments : []
// );

// export const selectRepliesByPostId = createSelector(
//     [selectPostById],
//     (post) => post 
//         ? post.comments.flatMap(comment => comment.replies) 
//         : []
// );





export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;


