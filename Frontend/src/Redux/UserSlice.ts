import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";


function initUsers(
  state: UserModel[],
  action: PayloadAction<UserModel[]>
): UserModel[] {
  return action.payload;
}

function updateUser(
  state: UserModel[],
  action: PayloadAction<UserModel>
): UserModel[] {
  const newState = [...state];
  const index = newState.findIndex((user) => user._id === action.payload._id);
  if (index >= 0) {
    newState[index] = action.payload;
  }

  return newState;
}

function deleteUser(
  state: UserModel[],
  action: PayloadAction<string>
): UserModel[] {
  const newState = [...state];
  const index = newState.findIndex((user) => user._id === action.payload);
  if (index >= 0) {
    newState.splice(index, 1);
  }

  return newState;
}

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: { initUsers, updateUser, deleteUser },
  });
  
  export const userActionCreators = userSlice.actions;
  
  export const userReducersContainer = userSlice.reducer;
