import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlices";
import jwtReducer from "./slices/JwtSlice";
import expensesReducer from "./slices/expensesSlice";
import billReducer from "./slices/BillSlice";
import bookingReducer from "./slices/BookingSlice";
import propertiesReducer from "./slices/PropertySlice";
import revenueReducer from "./slices/RevenuSlice";
import personalRevenueReducer from "./slices/PersonalRevenueSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    jwt: jwtReducer,
    expenses: expensesReducer,
    bills: billReducer,
    bookings: bookingReducer,
    properties: propertiesReducer,
    revenue: revenueReducer,
    personalRevenues: personalRevenueReducer,
  },
});

export default store;
