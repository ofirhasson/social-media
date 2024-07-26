import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";
import { PostModel } from "../Models/PostModel";


function initPosts(
  state: PostModel[],
  action: PayloadAction<PostModel[]>
): PostModel[] {
  return action.payload;
}


function createPost(state:PostModel[], action: PayloadAction<PostModel>):PostModel[] {
    return [...state, action.payload]
}

function updatePost(
  state: PostModel[],
  action: PayloadAction<PostModel>
): PostModel[] {
  const newState = [...state];
  const index = newState.findIndex((post) => post._id === action.payload._id);
  if (index >= 0) {
    newState[index] = action.payload;
  }

  return newState;
}

function deletePost(
  state: PostModel[],
  action: PayloadAction<string>
): PostModel[] {
  const newState = [...state];
  const index = newState.findIndex((post) => post._id === action.payload);
  if (index >= 0) {
    newState.splice(index, 1);
  }

  return newState;
}

const postSlice = createSlice({
    name: "post",
    initialState: null,
    reducers: { initPosts, createPost, updatePost ,deletePost },
  });
  
  export const postActionCreators = postSlice.actions;
  
  export const postReducersContainer = postSlice.reducer;


