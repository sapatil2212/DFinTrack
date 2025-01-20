import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BookingForm from "./BookingForm";
import { fetchBookings } from "../../../slices/BookingSlice";
import { fetchBills } from "../../../slices/BillSlice";

const dailyBookings = [
  { day: "Mon", bookings: 4 },
  { day: "Tue", bookings: 3 },
  { day: "Wed", bookings: 2 },
  { day: "Thu", bookings: 5 },
  { day: "Fri", bookings: 7 },
  { day: "Sat", bookings: 9 },
  { day: "Sun", bookings: 6 },
];

const BookingCard = () => {
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.bookings);
  const bills = useSelector((state) => state.bills.bills);

  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchBills());
  }, [dispatch]);

  const handleOpenBookingForm = () => setIsBookingFormOpen(true);
  const handleCloseBookingForm = () => setIsBookingFormOpen(false);

  const totalBookings = bookings.length;
  const totalBillsAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div>
      {/* Header Section */}
      <div className="container mx-auto w-full px-4 pt-5 lg:px-8 xl:max-w-7xl ">
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-start">
          <div className="grow">
            <h1 className="mb-2 text-3xl font-bold ">Manage Bookings</h1>
          </div>
          <div className="flex flex-none items-center justify-center gap-2 rounded sm:justify-end">
            <div className="relative">
              <button
                type="button"
                onClick={handleOpenBookingForm}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                New Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Statistics 
      <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Bookings 
          <div className="flex flex-col rounded-lg border border-indigo-200 bg-white shadow-md transition duration-300 ease-in-out hover:shadow-lg">
            <div className="flex grow items-center justify-between p-4">
              <dl>
                <dt className="text-3xl font-bold text-indigo-600">
                  {totalBookings}
                </dt>
                <dd className="text-sm font-medium text-indigo-800">
                  Total Bookings
                </dd>
              </dl>
              <div className="text-indigo-500">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="border-t border-indigo-100 bg-indigo-50 px-6 py-2 text-xs font-medium text-indigo-600">
              All Time
            </div>
          </div>

          {/* Total Bills Generated
          <div className="flex flex-col rounded-lg border border-green-200 bg-white shadow-md transition duration-300 ease-in-out hover:shadow-lg">
            <div className="flex grow items-center justify-between p-4">
              <dl>
                <dt className="text-3xl font-bold text-green-600">
                  ₹ {totalBillsAmount.toFixed(2)}
                </dt>
                <dd className="text-sm font-medium text-green-800">
                  Total Bills Generated
                </dd>
              </dl>
              <div className="text-green-500">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2-2 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="border-t border-green-100 bg-green-50 px-6 py-2 text-xs font-medium text-green-600">
              All Time
            </div>
          </div>

          {/* Daily Bookings Graph 
          <div className="col-span-1 flex flex-col rounded-lg border border-purple-200 bg-white shadow-md transition duration-300 ease-in-out hover:shadow-lg">
            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold text-purple-800">
                Daily Bookings
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dailyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#9f7aea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <BookingForm open={isBookingFormOpen} onClose={handleCloseBookingForm} />
    </div>
  );
};

export default BookingCard;
