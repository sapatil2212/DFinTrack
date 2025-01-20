import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingService } from "../services/BookingService";

export const fetchBookings = createAsyncThunk("bookings/fetchAll", async () => {
  const response = await bookingService.getAllBookings();
  return response;
});

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (bookingData) => {
    const response = await bookingService.createBooking(bookingData);
    return response;
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/update",
  async (bookingData) => {
    const response = await bookingService.updateBooking(
      bookingData.id,
      bookingData
    );
    return response;
  }
);
export const updateBookingStatus = createAsyncThunk(
  "bookings/updateStatus",
  async ({ bookingId, status }) => {
    const response = await bookingService.updateBookingStatus(
      bookingId,
      status
    );
    return response;
  }
);

export const checkoutBooking = createAsyncThunk(
  "bookings/checkout",
  async (bookingId) => {
    const response = await bookingService.checkoutBooking(bookingId);
    return response;
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(checkoutBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export default bookingSlice.reducer;
