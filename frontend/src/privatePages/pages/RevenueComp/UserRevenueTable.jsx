import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdCheckCircle } from "react-icons/md";
import { BsQuestionCircleFill } from "react-icons/bs";
import {
  fetchRevenuesForProperty,
  updateRevenue,
  deleteRevenue,
  clearSuccessMessage,
} from "../../../slices/RevenuSlice";
import { Button } from "@/components/ui/button";
import RevenueForm from "../RevenueComp/AddRevenueForm";
import UpdateRevenue from "./UpdateRevenue";
import {
  Pencil,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import DeleteModal from "../../../components/DeleteModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const UserRevenueTable = ({ propertyId }) => {
  const dispatch = useDispatch();
  const { revenues, loading, error, successMessage } = useSelector(
    (state) => state.revenue
  );
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [revenueToDelete, setRevenueToDelete] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [selectedRevenues, setSelectedRevenues] = useState([]);

  useEffect(() => {
    if (successMessage) {
      setShowSuccessModal(true);
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchRevenuesForProperty({ propertyId }));
    }
  }, [dispatch, propertyId]);

  const refreshData = () => {
    if (propertyId) {
      dispatch(fetchRevenuesForProperty({ propertyId }));
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const sortedRevenues = useMemo(() => {
    if (!Array.isArray(revenues)) return [];
    let sortableRevenues = [...revenues];
    if (sortConfig.key !== null) {
      sortableRevenues.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRevenues;
  }, [revenues, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleUpdate = async (revenueId, data) => {
    try {
      await dispatch(updateRevenue({ id: revenueId, data }));
      dispatch(fetchRevenuesForProperty({ propertyId }));
      return true;
    } catch (error) {
      console.error("Error updating revenue:", error);
      return false;
    }
  };

  const handleDelete = (revenue) => {
    setRevenueToDelete(revenue);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (revenueToDelete?.id) {
      await dispatch(deleteRevenue(revenueToDelete.id));
      dispatch(fetchRevenuesForProperty({ propertyId }));
      setIsDeleteModalOpen(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRevenues.length > 0) {
      setIsBulkDeleteModalOpen(true);
    }
  };

  const confirmBulkDelete = async () => {
    const validRevenues = selectedRevenues.filter((id) => !isNaN(id));

    if (validRevenues.length === 0) {
      console.error("No valid revenues to delete.");
      return;
    }

    for (const revenueId of validRevenues) {
      try {
        await dispatch(deleteRevenue(revenueId));
      } catch (error) {
        console.error("Error deleting revenue with ID", revenueId, error);
      }
    }

    setIsBulkDeleteModalOpen(false);
    dispatch(fetchRevenuesForProperty({ propertyId }));
    setSelectedRevenues([]);
  };

  const handleSelectRow = (revenueId) => {
    console.log("Selected revenue ID:", revenueId);

    if (revenueId && !isNaN(revenueId)) {
      setSelectedRevenues((prevSelected) =>
        prevSelected.includes(revenueId)
          ? prevSelected.filter((id) => id !== revenueId)
          : [...prevSelected, revenueId]
      );
    } else {
      console.error("Invalid revenue ID:", revenueId);
    }
  };

  const handleSuccessAddRevenue = () => {
    setShowForm(false);
    refreshData();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
    );

  return (
    <div className="p-6 bg-white rounded-xl border m-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Property Revenues</h2>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowForm(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white rounded-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Revenue
        </Button>
      </div>
      {showForm && (
        <RevenueForm
          onSubmit={handleUpdate}
          onClose={() => {
            setShowForm(false);
            setSelectedRevenue(null);
          }}
          onSuccess={handleSuccessAddRevenue}
        />
      )}
      {showUpdateForm && selectedRevenue && (
        <UpdateRevenue
          revenueId={selectedRevenue.id}
          initialValues={selectedRevenue}
          onSubmit={handleUpdate}
          onCancel={() => {
            setShowUpdateForm(false);
            setSelectedRevenue(null);
          }}
        />
      )}
      {/* Bulk delete button */}
      {selectedRevenues.length > 0 && (
        <Button
          variant="danger"
          onClick={handleBulkDelete}
          className="mb-4 border border-red-500 text-red-500"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Selected ({selectedRevenues.length})
        </Button>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full bg-white shadow">
          <thead className="bg-lightBlue">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      const validIds = revenues
                        .filter((rev) => rev.id)
                        .map((rev) => rev.id);
                      setSelectedRevenues(validIds);
                    } else {
                      setSelectedRevenues([]);
                    }
                  }}
                  checked={selectedRevenues.length === revenues.length}
                />
              </th>
              <th
                onClick={() => requestSort("amount")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
                {sortConfig.key === "amount" &&
                  (sortConfig.direction === "ascending" ? (
                    <ChevronUp className="inline-block ml-2 w-4 h-4" />
                  ) : (
                    <ChevronDown className="inline-block ml-2 w-4 h-4" />
                  ))}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Mode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRevenues.map((revenue, index) => (
              <tr key={revenue.id || index} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRevenues.includes(revenue.id)}
                    onChange={() => handleSelectRow(revenue.id)}
                  />
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm">
                  {revenue.amount}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm">
                  {revenue.source}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm">
                  {revenue.paymentMode}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm">
                  {revenue.description || "N/A"}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm">
                  {new Date(revenue.dateTime).toLocaleString()}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRevenue(revenue);
                      setShowUpdateForm(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(revenue)}
                    className="ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Delete Confirmation Modal */}
      <Dialog
        open={isBulkDeleteModalOpen}
        onOpenChange={setIsBulkDeleteModalOpen}
      >
        <DialogContent className="bg-white flex flex-col items-center justify-center p-6 max-w-md">
          <BsQuestionCircleFill className="text-red-500 text-5xl " />{" "}
          {/* Icon */}
          <DialogHeader className="text-center font-poppins text-sm">
            <DialogTitle className="text-xl">Confirm Bulk Delete</DialogTitle>
          </DialogHeader>
          <div className="text-center font-poppins text-sm">
            <p>
              Are you sure you want to delete {selectedRevenues.length} selected
              revenues?
            </p>
            <p className="text-red-500 text-xs ">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="w-full flex justify-center space-x-6 mt-2">
            <Button
              variant="danger"
              onClick={confirmBulkDelete}
              className="font-poppins bg-red-500 text-white text-sm "
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showSuccessModal && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50"
          onClick={() => setShowSuccessModal(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
            <MdCheckCircle className="text-green-500 text-4xl mx-auto" />
            <h3 className="text-xl font-semibold text-center">Success!</h3>
            <p className="text-center">Revenue added successfully.</p>
          </div>
        </div>
      )}

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        revenue={revenueToDelete}
        onDelete={confirmDelete}
      />
    </div>
  );
};

export default UserRevenueTable;
