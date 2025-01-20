import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { revenueService } from "../services/PersonalRevenueService";

export const createRevenue = createAsyncThunk(
  "revenues/createRevenue",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await revenueService.createRevenue({ data, token });
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create revenue"
      );
    }
  }
);

export const getRevenueById = createAsyncThunk(
  "revenues/getRevenueById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await revenueService.getRevenueById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllRevenues = createAsyncThunk(
  "revenues/getAllRevenues",
  async (_, { rejectWithValue }) => {
    try {
      const response = await revenueService.getAllRevenues();

      // The response already contains the correct structure
      // {data: [...], message: "..."}
      return response.data; // This will return the array of revenues
    } catch (error) {
      console.error("Error fetching all revenues:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateRevenue = createAsyncThunk(
  "revenues/updateRevenue",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await revenueService.updateRevenue(id, data);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteRevenue = createAsyncThunk(
  "revenues/deleteRevenue",
  async (id, { rejectWithValue }) => {
    try {
      const response = await revenueService.deleteRevenue(id);
      return { id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const personalRevenueSlice = createSlice({
  name: "personalRevenues",
  initialState: {
    revenues: [],
    revenue: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Revenue
      .addCase(createRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createRevenue.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.revenues.push(action.payload.data);
          state.successMessage = "Revenue created successfully";
        }
        state.error = null;
      })
      .addCase(createRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create revenue";
        state.successMessage = null;
      })

      .addCase(getRevenueById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRevenueById.fulfilled, (state, action) => {
        state.loading = false;
        state.revenue = action.payload.data;
        state.error = null;
      })
      .addCase(getRevenueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Revenues
      .addCase(getAllRevenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRevenues.fulfilled, (state, action) => {
        state.loading = false;
        state.revenues = action.payload;
        state.error = null;
      })
      .addCase(getAllRevenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.revenues = [];
      })

      // Update Revenue
      .addCase(updateRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRevenue.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.revenues.findIndex(
          (revenue) => revenue.id === action.payload.id
        );
        if (index !== -1) {
          state.revenues[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Revenue
      .addCase(deleteRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenues = state.revenues.filter(
          (revenue) => revenue.id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(deleteRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearSuccessMessage, clearError } = personalRevenueSlice.actions;
export default personalRevenueSlice.reducer;
