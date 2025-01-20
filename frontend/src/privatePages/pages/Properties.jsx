"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  PlusCircle,
  Trash2,
  Save,
  X,
  AlertTriangle,
  UserIcon,
  Eye,
  MapPin,
  Pencil,
  Info,
  Building,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteWarningModalOpen, setIsDeleteWarningModalOpen] =
    useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const propertyApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/properties`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const propertiesResponse = await propertyApi.get();
      const fetchedProperties = propertiesResponse.data;

      const propertiesWithUsers = await Promise.all(
        fetchedProperties.map(async (property) => {
          try {
            const userResponse = await propertyApi.get(`/${property.id}/users`);
            return { ...property, assignedUsers: userResponse.data };
          } catch (userError) {
            console.warn(
              `Could not fetch users for property ${property.id}`,
              userError
            );
            return { ...property, assignedUsers: [] };
          }
        })
      );

      setProperties(propertiesWithUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Failed to fetch properties");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProperty = async (newProperty) => {
    try {
      const response = await propertyApi.post("", newProperty);
      setProperties([...properties, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding property", error);
      setError("Failed to add property");
    }
  };

  const handleUpdateProperty = async (updatedProperty) => {
    try {
      const response = await propertyApi.put(
        `/${selectedProperty.id}`,
        updatedProperty
      );
      const updatedProperties = properties.map((prop) =>
        prop.id === selectedProperty.id ? response.data : prop
      );
      setProperties(updatedProperties);
      setIsModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error("Error updating property", error);
      setError("Failed to update property");
    }
  };

  const handleDeleteProperty = async () => {
    try {
      await propertyApi.delete(`/${selectedProperty.id}`);
      setProperties(
        properties.filter((property) => property.id !== selectedProperty.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error("Error deleting property", error);
      setError("Failed to delete property");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const openPropertyDetails = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProperties = useMemo(() => {
    let sortableProperties = [...properties];
    if (sortConfig.key !== null) {
      sortableProperties.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProperties;
  }, [properties, sortConfig]);

  const filteredProperties = useMemo(() => {
    return sortedProperties.filter(
      (property) =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedProperties, searchTerm]);

  const PropertyModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEditing,
  }) => {
    const [property, setProperty] = useState(initialData);

    useEffect(() => {
      setProperty(initialData);
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setProperty((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!property.name || !property.address) {
        alert("Name and address are required!");
        return;
      }
      onSubmit(property);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-[500px] p-8">
          <h2 className="text-xl font-semibold flex text-gray-800 mb-4 border-b pb-4">
            <Pencil className="mr-2" />
            {isEditing ? "Edit Property Details" : "Add New Property"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Property Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={property.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter property name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={property.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter property address"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={property.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Property description"
                rows="4"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="mr-2" size={18} />
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const UserDetailModal = ({ user, onClose, isOpen }) => {
    if (!isOpen || !user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col items-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <UserIcon size={64} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <Info size={20} className="mr-3 text-blue-500" />
              <span className="font-medium">User ID: {user.id}</span>
            </div>
            {user.phone && (
              <div className="flex items-center">
                <MapPin size={20} className="mr-3 text-green-500" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DeleteWarningModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center mb-4">
          <AlertTriangle className="text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-center">
            Property Can't Be Deleted
          </h2>
        </div>
        <p className="mb-4 text-gray-500 text-center">
          You must first delete the user account assigned to this property
          before deleting the property.
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={64} />
          <p className="text-xl text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white rounded-xl border  p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-semibold flex items-center">
            <Building className="mr-2" /> Property Management
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <button
              onClick={() => {
                setSelectedProperty(null);
                setIsModalOpen(true);
              }}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="mr-2" size={20} /> Add New Property
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th
                  className="py-3 px-4 text-left font-semibold cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Property Name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={16} className="inline" />
                    ) : (
                      <ChevronDown size={16} className="inline" />
                    ))}
                </th>
                <th
                  className="py-3 px-4 text-left font-semibold cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  Property ID{" "}
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={16} className="inline" />
                    ) : (
                      <ChevronDown size={16} className="inline" />
                    ))}
                </th>
                <th
                  className="py-3 px-4 text-left font-semibold cursor-pointer"
                  onClick={() => handleSort("address")}
                >
                  Address{" "}
                  {sortConfig.key === "address" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={16} className="inline" />
                    ) : (
                      <ChevronDown size={16} className="inline" />
                    ))}
                </th>
                <th className="py-3 px-4 text-left font-semibold">
                  Assigned Users
                </th>
                <th className="py-3 px-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{property.name}</td>
                  <td className="py-3 px-4">{property.id}</td>
                  <td className="py-3 px-4">{property.address}</td>
                  <td className="py-3 px-4">
                    {property.assignedUsers &&
                    property.assignedUsers.length > 0 ? (
                      <ul>
                        {property.assignedUsers.map((user) => (
                          <li key={user.id} className="mb-1">
                            <button
                              className="text-blue-600 hover:underline focus:outline-none"
                              onClick={() => openUserDetails(user)}
                            >
                              {user.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => openPropertyDetails(property)}
                      className="text-blue-500 hover:bg-blue-100 p-2 rounded transition-colors"
                      aria-label={`View details for ${property.name}`}
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProperty(property);
                        if (property.assignedUsers.length > 0) {
                          setIsDeleteWarningModalOpen(true);
                        } else {
                          setIsDeleteModalOpen(true);
                        }
                      }}
                      className="text-red-500 hover:bg-red-100 p-2 rounded transition-colors ml-2"
                      aria-label={`Delete ${property.name}`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProperty(null);
        }}
        onSubmit={selectedProperty ? handleUpdateProperty : handleAddProperty}
        initialData={
          selectedProperty || {
            name: "",
            address: "",
            description: "",
            assignedUsers: [],
          }
        }
        isEditing={!!selectedProperty}
      />

      <UserDetailModal
        isOpen={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      {isDeleteModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-3" size={24} />
              <h2 className="text-xl font-bold">Delete Property</h2>
            </div>
            <p className="mb-4 text-gray-500">
              Are you sure you want to delete this property? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteWarningModalOpen && selectedProperty && (
        <DeleteWarningModal
          onClose={() => setIsDeleteWarningModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Properties;
