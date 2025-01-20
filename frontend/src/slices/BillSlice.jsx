import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { billService } from "../services/BillService";

export const fetchBills = createAsyncThunk("bills/fetchAll", async () => {
  const response = await billService.getAllBills();
  return response;
});

export const createBill = createAsyncThunk(
  "bills/create",
  async (billData, { rejectWithValue }) => {
    try {
      const response = await billService.createBill(billData);
      return response;
    } catch (error) {
      if (
        error.response?.data?.error ===
        "Bill already generated for this booking"
      ) {
        return rejectWithValue({
          message: "Bill already generated for this booking.",
          code: error.response.status,
          existingBillError: true,
        });
      }
      return rejectWithValue({
        message: error.message || "An error occurred while generating the bill",
        code: 500,
      });
    }
  }
);

const billSlice = createSlice({
  name: "bills",
  initialState: {
    bills: [],
    status: "idle",
    error: null,
    existingBillError: false,
  },
  reducers: {
    clearExistingBillError: (state) => {
      state.existingBillError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bills = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.bills.push(action.payload);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
        if (action.payload.existingBillError) {
          state.existingBillError = true;
        }
      });
  },
});

export const { clearExistingBillError } = billSlice.actions;

export default billSlice.reducer;
