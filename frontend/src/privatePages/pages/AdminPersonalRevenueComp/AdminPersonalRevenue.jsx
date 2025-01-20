import React, { useState, useMemo, useEffect } from "react";
import {
  Pencil,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  FileDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  FileIcon as FilePdf,
} from "lucide-react";
import { BsQuestionCircleFill } from "react-icons/bs";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRevenues,
  createRevenue,
  updateRevenue,
  deleteRevenue,
  clearSuccessMessage,
} from "../../../slices/PersonalRevenueSlice";
import AdminPersonalRevenueForm from "../AdminPersonalRevenueComp/AdminAddRevenueForm";
import UpdateAdminRevenue from "./UpdateAdminRevenue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminPersonalRevenue = () => {
  const dispatch = useDispatch();
  const { revenues, loading, error, successMessage } = useSelector(
    (state) => state.personalRevenues
  );
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedRevenues, setSelectedRevenues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [revenueToDelete, setRevenueToDelete] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");

  // New state for filtering and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRevenueType, setFilterRevenueType] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [sortBy, setSortBy] = useState("amount");
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getAllRevenues());
  }, [dispatch]);

  // Filter and sort revenues
  const filteredAndSortedRevenues = useMemo(() => {
    let filtered = [...revenues];

    // Apply filters
    if (filterRevenueType !== "all") {
      filtered = filtered.filter(
        (rev) => rev.revenueType === filterRevenueType
      );
    }
    if (filterDateFrom) {
      filtered = filtered.filter(
        (rev) => new Date(rev.dateTime) >= new Date(filterDateFrom)
      );
    }
    if (filterDateTo) {
      filtered = filtered.filter(
        (rev) => new Date(rev.dateTime) <= new Date(filterDateTo)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "amount") {
        return a.amount - b.amount;
      } else if (sortBy === "revenueType") {
        return a.revenueType.localeCompare(b.revenueType);
      } else if (sortBy === "dateTime") {
        return new Date(a.dateTime) - new Date(b.dateTime);
      }
      return 0;
    });

    if (sortConfig.direction === "descending") {
      filtered.reverse();
    }

    return filtered;
  }, [
    revenues,
    filterRevenueType,
    filterDateFrom,
    filterDateTo,
    sortBy,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRevenues.length / itemsPerPage);
  const paginatedRevenues = filteredAndSortedRevenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Export functions
  const handleExportClick = (format) => {
    try {
      const dataToExport = filteredAndSortedRevenues.map((revenue) => ({
        Amount: revenue.amount,
        RevenueType: revenue.revenueType,
        PaymentMode: revenue.paymentMode,
        Description: revenue.description,
        Bank: revenue.bank,
        AdminName: revenue.adminName,
        DateTime: new Date(revenue.dateTime).toLocaleString(),
      }));

      if (format === "excel") {
        exportToExcel(dataToExport);
      } else if (format === "word") {
        exportToWord(dataToExport);
      } else if (format === "pdf") {
        exportToPDF(dataToExport);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      // You might want to show an error message to the user here
    }
  };

  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Personal Revenues");
    XLSX.writeFile(wb, "Personal_Revenue_Report.xlsx");
  };

  const exportToWord = (data) => {
    // Implementation would go here with appropriate Word export library
    console.log("Export to Word:", data);
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Amount",
          "Revenue Type",
          "Payment Mode",
          "Description",
          "Bank",
          "Admin Name",
          "Date & Time",
        ],
      ],
      body: data.map((revenue) => [
        revenue.Amount,
        revenue.RevenueType,
        revenue.PaymentMode,
        revenue.Description,
        revenue.Bank,
        revenue.AdminName,
        revenue.DateTime,
      ]),
    });
    doc.save("Personal_Revenue_Report.pdf");
  };

  useEffect(() => {
    if (successMessage) {
      setSuccessModalMessage(successMessage);
      setShowSuccessModal(true);
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        setSuccessModalMessage("");
        dispatch(clearSuccessMessage());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setSortBy(key);
  };

  const handleSelectRow = (revenueId) => {
    if (revenueId && !isNaN(revenueId)) {
      setSelectedRevenues((prevSelected) =>
        prevSelected.includes(revenueId)
          ? prevSelected.filter((id) => id !== revenueId)
          : [...prevSelected, revenueId]
      );
    }
  };

  const handleUpdateClick = (revenue) => {
    setSelectedRevenue(revenue);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (revenueId, updatedData) => {
    try {
      await dispatch(
        updateRevenue({
          id: revenueId,
          data: {
            ...updatedData,
            dateTime: new Date().toISOString(),
          },
        })
      ).unwrap();
      await dispatch(getAllRevenues());
      setIsUpdateModalOpen(false);
      setSelectedRevenue(null);
      setSuccessModalMessage("Revenue updated successfully.");
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setSuccessModalMessage("");
      }, 3000);
      return true;
    } catch (error) {
      console.error("Failed to update revenue:", error);
      return false;
    }
  };

  const confirmDelete = async () => {
    if (revenueToDelete?.id) {
      try {
        await dispatch(deleteRevenue(revenueToDelete.id));
        await dispatch(getAllRevenues());
        setIsDeleteModalOpen(false);
        setRevenueToDelete(null);
        setSuccessModalMessage("Revenue deleted successfully.");
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Failed to delete revenue:", error);
      }
    }
  };

  const handleDelete = (revenue) => {
    setRevenueToDelete(revenue);
    setIsDeleteModalOpen(true);
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
    await dispatch(getAllRevenues());
    setSelectedRevenues([]);
    setSuccessModalMessage("Selected revenues deleted successfully.");
    setShowSuccessModal(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRevenueCreated = () => {
    dispatch(getAllRevenues());
    setIsModalOpen(false);
    setShowSuccessModal(true);
    setSuccessModalMessage("Revenue created successfully.");
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white rounded-xl border m-3">
      <h2 className="text-md font-semibold">My Personal Revenue</h2>
      <div className="p-4">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">From Date</label>
            <Input
              type="date"
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-[200px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">To Date</label>
            <Input
              type="date"
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-[200px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Sort By</label>
            <Select onValueChange={setSortBy} defaultValue="amount">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="revenueType">Revenue Type</SelectItem>
                <SelectItem value="dateTime">Date & Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 items-center mt-6 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => handleExportClick("excel")}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportClick("word")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Word Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportClick("pdf")}>
                  <FilePdf className="w-4 h-4 mr-2" />
                  PDF Format
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="default"
              className="bg-blue-700 hover:bg-blue-800 text-white"
              onClick={openModal}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Revenue
            </Button>
          </div>
        </div>

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
                        const validIds = paginatedRevenues
                          .filter((rev) => rev.id)
                          .map((rev) => rev.id);
                        setSelectedRevenues(validIds);
                      } else {
                        setSelectedRevenues([]);
                      }
                    }}
                    checked={
                      selectedRevenues.length === paginatedRevenues.length
                    }
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
                <th
                  onClick={() => requestSort("revenueType")}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Revenue Type
                  {sortConfig.key === "revenueType" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="inline-block ml-2 w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline-block ml-2 w-4 h-4" />
                    ))}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin Name
                </th>
                <th
                  onClick={() => requestSort("dateTime")}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                  {sortConfig.key === "dateTime" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="inline-block ml-2 w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline-block ml-2 w-4 h-4" />
                    ))}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRevenues.map((revenue) => (
                <tr key={revenue.id} className="hover:bg-gray-100">
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
                    {revenue.revenueType}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    {revenue.paymentMode}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    {revenue.description || "N/A"}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    {revenue.bank}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    {revenue.adminName}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm">
                    {new Date(revenue.dateTime).toLocaleString()}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateClick(revenue)}
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
          <div className="flex justify-between items-center mt-4 p-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isModalOpen && (
          <AdminPersonalRevenueForm
            onClose={closeModal}
            onSuccess={handleRevenueCreated}
          />
        )}

        {isUpdateModalOpen && selectedRevenue && (
          <UpdateAdminRevenue
            onSubmit={handleUpdateSubmit}
            initialValues={selectedRevenue}
            onCancel={() => {
              setIsUpdateModalOpen(false);
              setSelectedRevenue(null);
            }}
            revenueId={selectedRevenue.id}
          />
        )}

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="bg-white flex flex-col items-center justify-center p-6 max-w-md">
            <BsQuestionCircleFill className="text-red-500 text-5xl" />
            <DialogHeader className="text-center font-poppins text-sm">
              <DialogTitle className="text-xl">Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="text-center font-poppins text-sm">
              <p>Are you sure you want to delete this revenue?</p>
              <p className="text-red-500 text-xs">
                This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="w-full flex justify-center space-x-6 mt-2">
              <Button
                variant="danger"
                onClick={confirmDelete}
                className="font-poppins bg-red-500 text-white text-sm"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isBulkDeleteModalOpen}
          onOpenChange={setIsBulkDeleteModalOpen}
        >
          <DialogContent className="bg-white flex flex-col items-center justify-center p-6 max-w-md">
            <BsQuestionCircleFill className="text-red-500 text-5xl" />
            <DialogHeader className="text-center font-poppins text-sm">
              <DialogTitle className="text-xl">Confirm Bulk Delete</DialogTitle>
            </DialogHeader>
            <div className="text-center font-poppins text-sm">
              <p>
                Are you sure you want to delete {selectedRevenues.length}{" "}
                selected revenues?
              </p>
              <p className="text-red-500 text-xs">
                This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="w-full flex justify-center space-x-6 mt-2">
              <Button
                variant="danger"
                onClick={confirmBulkDelete}
                className="font-poppins bg-red-500 text-white text-sm"
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
              <MdCheckCircle className="text-green-500 text-4xl mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-center mb-2">
                Success!
              </h3>
              <p className="text-center">{successModalMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPersonalRevenue;
