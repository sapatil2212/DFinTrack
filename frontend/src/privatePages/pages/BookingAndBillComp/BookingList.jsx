import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookings,
  updateBookingStatus,
} from "../../../slices/BookingSlice";
import { billService } from "../../../services/BillService";
import { bookingService } from "../../../services/BookingService";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";
import { Eye, Loader2, Pencil, Forward, FileText, Search } from "lucide-react";
import ViewBookingDetails from "../BookingAndBillComp/ViewBookingDetails";
import EditBookingDetails from "../BookingAndBillComp/UpdateBookingDetails";
import GenerateBillModal from "../BookingAndBillComp/GenerateBill";
import ViewBillDetails from "../BookingAndBillComp/ViewBillDetails";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProperties } from "../../../slices/PropertySlice";

const BookingList = () => {
  const dispatch = useDispatch();
  const { bookings, status, error } = useSelector((state) => state.bookings);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isGenerateBillModalOpen, setIsGenerateBillModalOpen] = useState(false);
  const [isViewBillModalOpen, setIsViewBillModalOpen] = useState(false);
  const [billStatuses, setBillStatuses] = useState({});
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProperty, setFilterProperty] = useState("all");
  const { properties } = useSelector((state) => state.properties);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.accountType);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    if (userRole === "ADMIN") {
      dispatch(fetchProperties());
    }
  }, [dispatch, userRole]);

  // New effect to check bill statuses
  useEffect(() => {
    const checkBillStatuses = async () => {
      if (!bookings) return;

      const statuses = {};
      for (const booking of bookings) {
        try {
          const bill = await billService.getBillsByBookingId(booking.id);
          statuses[booking.id] = bill != null;
        } catch (error) {
          console.error(
            `Error checking bill status for booking ${booking.id}:`,
            error
          );
          statuses[booking.id] = false;
        }
      }
      setBillStatuses(statuses);
    };

    checkBillStatuses();
  }, [bookings]);

  useEffect(() => {
    if (bookings && userRole) {
      const sortedBookings = [...bookings].sort(
        (a, b) => new Date(b.bookingDateTime) - new Date(a.bookingDateTime)
      );

      let userFilteredBookings =
        userRole === "ADMIN"
          ? sortedBookings
          : sortedBookings.filter((booking) => booking.userId === userId);

      // Apply search filter
      if (searchTerm) {
        userFilteredBookings = userFilteredBookings.filter(
          (booking) =>
            booking.guestName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            booking.phoneNo.includes(searchTerm) ||
            booking.roomNo.includes(searchTerm)
        );
      }

      // Apply status filter
      if (filterStatus !== "all") {
        userFilteredBookings = userFilteredBookings.filter(
          (booking) =>
            (filterStatus === "checkedIn" && !booking.checkedOut) ||
            (filterStatus === "checkedOut" && booking.checkedOut)
        );
      }

      // Apply property filter
      if (filterProperty !== "all") {
        userFilteredBookings = userFilteredBookings.filter(
          (booking) => booking.propertyId.toString() === filterProperty
        );
      }

      setFilteredBookings(userFilteredBookings);
      setCurrentPage(1);
    }
  }, [bookings, userRole, userId, searchTerm, filterStatus, filterProperty]);

  // Pagination calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredBookings.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredBookings.length / entriesPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleCheckout = async (booking) => {
    setSelectedBooking(booking);
    setIsGenerateBillModalOpen(true);
  };

  const handleViewBill = async (booking) => {
    try {
      const bill = await billService.getBillsByBookingId(booking.id);
      setSelectedBill(bill);
      setIsViewBillModalOpen(true);
    } catch (error) {
      console.error("Error viewing bill:", error);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsViewPopupOpen(true);
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setIsEditPopupOpen(true);
  };

  const handleGenerateBillSuccess = async (bookingId) => {
    setIsGenerateBillModalOpen(false);
    setBillStatuses((prev) => ({
      ...prev,
      [bookingId]: true,
    }));

    try {
      await dispatch(updateBookingStatus({ bookingId, status: "CHECKEDOUT" }));
      dispatch(fetchBookings());
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading bookings: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
      <h2 className="text-md font-semibold mb-4 text-gray-700">
        {userRole === "ADMIN" ? "All Bookings :" : "Your Bookings :"}
      </h2>

      <div className=" flex flex-col sm:flex-row gap-4">
        {/* Entries per page selector */}
        <div className="mb-4 flex items-center font-poppins">
          <span className="text-sm text-gray-600 mr-2">Show entries:</span>
          <Select
            value={entriesPerPage.toString()}
            onValueChange={(value) => {
              setEntriesPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px] bg-white font-poppins">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white font-poppins">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search by name, Phone No, or Room No."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10  bg-white"
          />
          <Search className="bg-white absolute left-3 top-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="bg-white w-full sm:w-[180px] border border-gray-300 rounded-md">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 rounded-md font-poppins">
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="checkedIn">Checked In</SelectItem>
            <SelectItem value="checkedOut">Checked Out</SelectItem>
          </SelectContent>
        </Select>

        {userRole === "ADMIN" && (
          <Select value={filterProperty} onValueChange={setFilterProperty}>
            <SelectTrigger className="bg-white w-full sm:w-[180px] border border-gray-300 rounded-md">
              <SelectValue placeholder="Filter by property" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 rounded-md font-poppins">
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id.toString()}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="overflow-x-auto border rounded  bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-2 text-left text-xs font-semibold text-gray-700">
                Booking ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Guest Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Check-In / Check-Out
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Phone No
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Room No
              </th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentEntries.map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {booking.id}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {booking.guestName}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {format(new Date(booking.checkInDate), "MMM dd, yyyy")} -{" "}
                  {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      booking.checkedOut
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {booking.checkedOut ? "CHECKED OUT" : "CHECKED IN"}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {booking.phoneNo}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {booking.roomNo}
                </td>
                <td className="px-4 py-2 text-sm text-center">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditBooking(booking)}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 ml-2"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {billStatuses[booking.id] ? (
                    <button
                      onClick={() => handleViewBill(booking)}
                      className="inline-flex items-center gap-2 rounded-lg border border-blue-500 bg-white px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50 ml-2"
                    >
                      View Bill
                      <FileText className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheckout(booking)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500 bg-white px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 ml-2"
                      disabled={booking.checkedOut}
                    >
                      Check out
                      <Forward className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-300">
          Showing {indexOfFirstEntry + 1} to{" "}
          {Math.min(indexOfLastEntry, filteredBookings.length)} of{" "}
          {filteredBookings.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {isViewPopupOpen && selectedBooking && (
        <ViewBookingDetails
          open={isViewPopupOpen}
          booking={selectedBooking}
          onClose={() => setIsViewPopupOpen(false)}
        />
      )}

      {isEditPopupOpen && selectedBooking && (
        <EditBookingDetails
          isOpen={isEditPopupOpen}
          booking={selectedBooking}
          onClose={() => {
            setIsEditPopupOpen(false);
            dispatch(fetchBookings());
          }}
        />
      )}

      {isGenerateBillModalOpen && selectedBooking && (
        <GenerateBillModal
          isOpen={isGenerateBillModalOpen}
          onClose={() => setIsGenerateBillModalOpen(false)}
          booking={selectedBooking}
          onSuccess={() => handleGenerateBillSuccess(selectedBooking.id)}
        />
      )}

      {isViewBillModalOpen && selectedBill && (
        <ViewBillDetails
          isOpen={isViewBillModalOpen}
          onClose={() => setIsViewBillModalOpen(false)}
          billDetails={selectedBill}
        />
      )}
    </div>
  );
};

export default BookingList;
