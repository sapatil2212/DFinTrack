import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { revenueService } from "../services/RevenueService";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const createThunkAction = (type, serviceMethod) =>
  createAsyncThunk(`revenue/${type}`, async (payload, { rejectWithValue }) => {
    try {
      const response = await serviceMethod(payload);
      toast.success(`Revenue ${type} successfully`);
      return response;
    } catch (error) {
      const message = error.message || `Failed to ${type} revenue`;
      toast.error(message);
      return rejectWithValue(message);
    }
  });

export const fetchRevenues = createThunkAction("fetchRevenues", () =>
  revenueService.getAllRevenues()
);

export const fetchRevenuesForProperty = createAsyncThunk(
  "revenue/fetchRevenuesForProperty",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      const decodedToken = jwtDecode(token);
      const propertyId = decodedToken?.propertyId;

      if (!propertyId) {
        throw new Error("Property ID is missing in token");
      }

      const response = await revenueService.getAllRevenuesByPropertyId(
        propertyId
      );
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch revenues.");
    }
  }
);

export const createRevenue = createAsyncThunk(
  "revenue/createRevenue",
  async (revenueData, { rejectWithValue }) => {
    try {
      const response = await revenueService.createRevenue(revenueData);
      toast.success("Revenue created successfully");
      console.log("Revenuecreated!");
      return response;
    } catch (error) {
      const message = error.message || "Failed to create revenue";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateRevenue = createThunkAction(
  "updateRevenue",
  ({ id, data }) => revenueService.updateRevenue(id, data)
);

export const deleteRevenue = createAsyncThunk(
  "revenue/deleteRevenue",
  async (id, { rejectWithValue }) => {
    try {
      await revenueService.deleteRevenue(id);
      toast.success("Revenue deleted successfully");
      return id; // Return the id of deleted revenue
    } catch (error) {
      const message = error.message || "Failed to delete revenue";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const revenueSlice = createSlice({
  name: "revenue",
  initialState: {
    revenues: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchRevenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenues.fulfilled, (state, action) => {
        state.loading = false;
        state.revenues = action.payload;
      })
      .addCase(fetchRevenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch revenues for property cases
      .addCase(fetchRevenuesForProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenuesForProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.revenues = action.payload || [];
      })
      .addCase(fetchRevenuesForProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create revenue case
      .addCase(createRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenues.push(action.payload);
        state.successMessage = "Revenue created successfully";
      })
      .addCase(createRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      // Delete revenue cases
      .addCase(deleteRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRevenue.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted revenue from the state
        state.revenues = state.revenues.filter(
          (revenue) => revenue.id !== action.payload
        );
        state.successMessage = "Revenue deleted successfully";
      })
      .addCase(deleteRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearError, setSuccessMessage, clearSuccessMessage } =
  revenueSlice.actions;
export default revenueSlice.reducer;
