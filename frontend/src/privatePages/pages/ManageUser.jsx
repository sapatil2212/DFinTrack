"use client";

import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  getCaretakers,
  getAdmins,
  addUser,
  deleteUser,
  updateUser,
} from "../../services/ManageUserService";
import {
  Eye,
  Trash2,
  UserPen,
  PlusCircle,
  Filter,
  Users,
  X,
  Edit,
} from "lucide-react";
import { MdCheckCircle } from "react-icons/md";

const ManageUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [newUser, setNewUser] = useState({
    accountType: "USER",
    name: "",
    email: "",
    securityKey: "",
    password: "",
    confirmPassword: "",
    propertyId: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortType, setSortType] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchProperties();
    fetchUsers();
  }, [sortType]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/properties`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setErrors((prev) => ({
        ...prev,
        properties: "Error fetching properties. Please try again.",
      }));
    }
  };

  const fetchUsers = async () => {
    try {
      let data;
      if (sortType === "ALL") {
        data = await getAllUsers();
      } else if (sortType === "ADMIN") {
        data = await getAdmins();
      } else if (sortType === "USER") {
        data = await getCaretakers();
      }
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newUser.name.trim()) newErrors.name = "Name is required";
    if (!newUser.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!newUser.password) {
      newErrors.password = "Password is required";
    } else if (newUser.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (newUser.password !== newUser.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (newUser.accountType === "USER" && !newUser.propertyId) {
      newErrors.propertyId = "Property selection is required for caretakers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        accountType: newUser.accountType,
        propertyId: newUser.propertyId,
        securityKey: newUser.securityKey,
      };

      await addUser(userData);
      await fetchUsers();
      setNewUser({
        accountType: "USER",
        name: "",
        email: "",
        securityKey: "",
        password: "",
        confirmPassword: "",
        propertyId: "",
      });
      setShowAddUserForm(false);
      setSuccessMessage("User added successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding user:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to add user. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      await fetchUsers();

      // Show success modal with a timeout
      setSuccessMessage("User deleted successfully.");
      setShowSuccessModal(true);
      setErrorMessage("");

      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error("Error deleting user:", error);

      setErrorMessage("Failed to delete the user account. Please try again.");
      setShowErrorModal(true);

      setTimeout(() => setShowErrorModal(false), 3000);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({
      ...user,
      confirmPassword: user.password,
    });
    setShowEditUserForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const updatedUserData = {
        id: selectedUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        accountType: newUser.accountType,
        propertyId: newUser.propertyId,
        securityKey: newUser.securityKey,
      };

      await updateUser(selectedUser.id, updatedUserData);
      await fetchUsers();
      setShowEditUserForm(false);
      setSelectedUser(null);
      setNewUser({
        accountType: "USER",
        name: "",
        email: "",
        securityKey: "",
        password: "",
        confirmPassword: "",
        propertyId: "",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to update user. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto px-4 py-8  min-h-screen">
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-white text-black px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center">
            <Users className="mr-2" /> User Management
          </h1>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                size={18}
              />
              <select
                name="sortType"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="pl-10  py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="ALL">All Users</option>
                <option value="ADMIN">Admins</option>
                <option value="USER">Caretakers</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddUserForm(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-md flex items-center hover:bg-blue-800 transition-colors"
            >
              <PlusCircle className="mr-2" size={18} /> Add Caretaker
            </button>
          </div>
        </div>

        {showAddUserForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Caretaker</h2>
                <button onClick={() => setShowAddUserForm(false)}>
                  <X className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className={`border p-2 rounded-md w-full ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`border p-2 rounded-md w-full ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className={`border p-2 rounded-md w-full ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={newUser.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    className={`border p-2 rounded-md w-full ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    name="accountType"
                    value={newUser.accountType}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full"
                  >
                    <option value="USER">Caretaker</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                {newUser.accountType === "USER" && (
                  <div>
                    <select
                      name="propertyId"
                      value={newUser.propertyId}
                      onChange={handleInputChange}
                      className={`border p-2 rounded-md w-full ${
                        errors.propertyId ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Property</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name}
                        </option>
                      ))}
                    </select>
                    {errors.propertyId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.propertyId}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <input
                    type="text"
                    name="securityKey"
                    value={newUser.securityKey}
                    onChange={handleInputChange}
                    placeholder="Security Key (Optional)"
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Adding..." : "Add User"}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {Array.isArray(users) && users.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Email</th>
                  <th className="py-3 px-4 text-left font-semibold">
                    Account Type
                  </th>
                  <th className="py-3 px-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.accountType === "ADMIN"
                            ? "bg-green-200 text-green-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {user.accountType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => handleViewUser(user)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800 transition-colors"
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-600 transition-colors"
                          onClick={() => {
                            setUserIdToDelete(user.id);
                            setIsModalOpen(true);
                          }}
                          aria-label="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No users found. Try a different filter or add a new user.
            </div>
          )}
        </div>
      </div>

      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Delete User Account</h2>
            <p className="mb-4">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteUser(userIdToDelete);
                  setIsModalOpen(false);
                  setUserIdToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50"
          onClick={() => setShowSuccessModal(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto text-center">
            <MdCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Success!</h3>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-5 right-5 bg-red-50 border border-red-200 p-4 rounded-lg shadow-lg z-50">
          <p className="text-red-600 font-medium">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage("")}
            className="text-red-500 hover:text-red-700 ml-4"
          >
            Close
          </button>
        </div>
      )}

      {showModal && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-2xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 py-4 flex items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 13H8a4 4 0 00-4 4v2h16v-2a4 4 0 00-4-4z"
                    />
                  </svg>
                </div>
                <h3
                  className="ml-4 text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  User Details
                </h3>
              </div>

              <div className="bg-white px-6 py-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedUser.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedUser.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Account Type:</span>{" "}
                    {selectedUser.accountType}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Property:</span>{" "}
                    {selectedUser.propertyName || "No Property Assigned"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Registration Date:</span>{" "}
                    {new Date(selectedUser.registrationDate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditUserForm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl flex font-semibold">
                <UserPen className="mr-2" />
                Edit User
              </h2>
              <button onClick={() => setShowEditUserForm(false)}>
                <X className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className={`border p-2 rounded-md w-full ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`border p-2 rounded-md w-full ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`border p-2 rounded-md w-full ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className={`border p-2 rounded-md w-full ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div>
                <select
                  name="accountType"
                  value={newUser.accountType}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full"
                >
                  <option value="USER">Caretaker</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              {newUser.accountType === "USER" && (
                <div>
                  <select
                    name="propertyId"
                    value={newUser.propertyId}
                    onChange={handleInputChange}
                    className={`border p-2 rounded-md w-full ${
                      errors.propertyId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                  {errors.propertyId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.propertyId}
                    </p>
                  )}
                </div>
              )}
              <div>
                <input
                  type="text"
                  name="securityKey"
                  value={newUser.securityKey}
                  onChange={handleInputChange}
                  placeholder="Security Key (Optional)"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Updating..." : "Update User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
