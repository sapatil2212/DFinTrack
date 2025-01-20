import { createSlice } from "@reduxjs/toolkit";

const jwtSlice = createSlice({
  name: "jwt",
  initialState: localStorage.getItem("token") || null,
  reducers: {
    setJwt: (state, action) => {
      localStorage.setItem("token", action.payload);
      return action.payload;
    },
    removeJwt: (state) => {
      localStorage.removeItem("token");
      return null;
    },
  },
});

export const { setJwt, removeJwt } = jwtSlice.actions;
export default jwtSlice.reducer;
