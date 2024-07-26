import { configureStore } from "@reduxjs/toolkit";
import { authReducersContainer } from "./AuthSlice";
import { userReducersContainer } from "./UserSlice";
import { postReducersContainer } from "./PostSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { AppState } from "./AppState";
import { commentReducersContainer } from "./CommentsSlice";

// This line initializes the Redux store using the configureStore function, which is provided by the Redux Toolkit.
export const appStore = configureStore({
  // The `reducer` key specifies the root reducer for the Redux store. It combines multiple reducers into a single reducer function.
  reducer: {
    // auth is a slice of the state managed by the `authReducersContainer` reducer.
    auth: authReducersContainer,

    // user is a slice of the state managed by the `userReducersContainer` reducer.
    users: userReducersContainer,

    posts: postReducersContainer,

    comments: commentReducersContainer
  },
});

// export type AppDispatch = typeof appStore.dispatch;

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
