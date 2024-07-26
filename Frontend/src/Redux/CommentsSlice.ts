import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CommentModel } from "../Models/CommentModel";


function initComments(state:CommentModel[], action:PayloadAction<CommentModel[]>):CommentModel[] {
    return action.payload
}

function addComment(
  state: CommentModel[],
  action: PayloadAction<CommentModel>
): CommentModel[] {
  return [...state, action.payload];
}

function updateComment(
  state: CommentModel[],
  action: PayloadAction<CommentModel>
): CommentModel[] {
  const newState = [...state];
  const index = newState.findIndex(
    (comment) => comment._id === action.payload._id
  );
  if (index >= 0) {
    newState[index] = action.payload;
  }

  return newState;
}

function deleteComment(
  state: CommentModel[],
  action: PayloadAction<string>
): CommentModel[] {
  const newState = [...state];
  const index = newState.findIndex((comment) => comment._id === action.payload);
  if (index >= 0) {
    newState.splice(index, 1);
  }

  return newState;
}

const commentSlice = createSlice({
  name: "post",
  initialState: null,
  reducers: { addComment, updateComment, deleteComment, initComments },
});

export const commentActionCreators = commentSlice.actions;

export const commentReducersContainer = commentSlice.reducer;
