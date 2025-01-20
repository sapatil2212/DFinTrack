import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBooking } from "../../../slices/BookingSlice";
import { fetchProperties } from "../../../slices/PropertySlice";
import { jwtDecode } from "jwt-decode";
import SuccessModal from "../../../components/SuccessModal";

const BookingForm = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [accountType, setAccountType] = useState(null);
  const [error, setError] = useState("");

  const properties = useSelector((state) => state.properties.properties);
  const propertiesStatus = useSelector((state) => state.properties.status);

  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phoneNo: "",
    checkInDate: "",
    checkOutDate: "",
    roomNo: "",
    noOfGuests: 0,
    noOfChildren: 0,
    companyName: "",
    propertyId: "",
    isCheckedOut: false,
    documentSubmitted: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAccountType(decoded.accountType);

        if (decoded.accountType === "ADMIN") {
          dispatch(fetchProperties());
        } else {
          setFormData((prev) => ({
            ...prev,
            propertyId: decoded.propertyId,
          }));
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Error loading user data");
      }
    }
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);

      // Validate propertyId based on user type
      if (decoded.accountType === "ADMIN" && !formData.propertyId) {
        throw new Error("Please select a property");
      }

      const bookingData = {
        ...formData,
        noOfGuests: parseInt(formData.noOfGuests, 10),
        noOfChildren: parseInt(formData.noOfChildren, 10),
        documentSubmitted: "Passport",
        userId: decoded.id,
        bookingDateTime: new Date().toISOString(),
        // For admin, use selected propertyId; for others, use token propertyId
        propertyId:
          decoded.accountType === "ADMIN"
            ? parseInt(formData.propertyId, 10)
            : decoded.propertyId,
      };

      const result = await dispatch(createBooking(bookingData)).unwrap();
      setSuccessMessage("Booking Confirmed!");
      setIsSuccessModalOpen(true);

      // Reset form while preserving propertyId for non-admin
      const preservedPropertyId =
        decoded.accountType !== "ADMIN" ? formData.propertyId : "";
      setFormData({
        guestName: "",
        email: "",
        phoneNo: "",
        checkInDate: "",
        checkOutDate: "",
        roomNo: "",
        noOfGuests: 0,
        noOfChildren: 0,
        companyName: "",
        propertyId: preservedPropertyId,
        isCheckedOut: false,
        documentSubmitted: null,
      });

      setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Failed to create booking:", error);
      setError(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };
  useEffect(() => {
    if (isSuccessModalOpen) {
      const timeout = setTimeout(() => {
        handleCloseSuccessModal();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isSuccessModalOpen]);
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    onClose();
  };

  return (
    open && (
      <div className="container mx-auto fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
        <div className="bg-white w-full sm:max-w-[300px] md:max-w-[400px] lg:max-w-[600px] xl:max-w-[600px] 2xl:max-w-[450px] rounded-lg shadow-lg p-6">
          {/* Form Header */}
          <div className="flex flex-col justify-between items-start mb-2">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-lg sm:text-sm md:text-md lg:text-lg font-semibold">
                New Booking
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            {error && (
              <div className="w-full mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Selection for Admin */}
            {accountType === "ADMIN" && (
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-700">
                  Select Property *
                </label>
                <select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    placeholder="Enter guest name"
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">
                    Room No.
                  </label>
                  <input
                    type="text"
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleChange}
                    placeholder="Enter room number"
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    name="noOfGuests"
                    value={formData.noOfGuests}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">
                    Number of Children
                  </label>
                  <input
                    type="number"
                    name="noOfChildren"
                    value={formData.noOfChildren}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Document Submitted (Optional)
                </label>
                <input
                  type="file"
                  name="documentSubmitted"
                  onChange={handleFileChange}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                >
                  {isSubmitting ? "Saving..." : "Book Now"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          message={successMessage}
          onClose={handleCloseSuccessModal}
        />
      </div>
    )
  );
};

export default BookingForm;
