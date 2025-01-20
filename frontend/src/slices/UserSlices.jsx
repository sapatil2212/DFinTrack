import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: JSON.parse(localStorage.getItem("user")) || null,
  reducers: {
    setUser: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    },
    updateUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    logOut: (state) => {
      localStorage.removeItem("user");
      return null;
    },
  },
});

export const { setUser, logOut, updateUser } = userSlice.actions;
export default userSlice.reducer;
