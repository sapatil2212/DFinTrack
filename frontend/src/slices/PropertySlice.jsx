import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { propertyService } from "../services/PropertyService";

// Fetch properties async action
export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async () => {
    const response = await propertyService.getAllProperties();
    return response;
  }
);

// Initial state for properties slice
const initialState = {
  properties: [],
  status: "idle",
  error: null,
};

// Property slice
const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default propertySlice.reducer;
