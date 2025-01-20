import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRevenues,
  deleteRevenue,
  updateRevenue,
} from "../../../slices/RevenuSlice";
import { MdCheckCircle } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  FileDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, FileText, FileIcon as FilePdf } from "lucide-react";
import DeleteModal from "../../../components/DeleteModel";

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import UpdateRevenue from "../RevenueComp/UpdateRevenue"; // Import UpdateRevenue component

const AdminRevenueTable = () => {
  const dispatch = useDispatch();
  const { revenues, loading, error } = useSelector((state) => state.revenue);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [revenueToDelete, setRevenueToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filterProperty, setFilterProperty] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [sortBy, setSortBy] = useState("amount");

  const [revenueId, setRevenueId] = useState(null);

  useEffect(() => {
    dispatch(fetchRevenues());
  }, [dispatch]);

  const handleOpenModal = (revenue) => {
    setSelectedRevenue(revenue);
    setRevenueId(revenue.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRevenue(null);
    dispatch(fetchRevenues());
  };

  const handleUpdateRevenue = async (id, data) => {
    try {
      const result = await dispatch(updateRevenue({ id, data })).unwrap();
      if (result) {
        await dispatch(fetchRevenues());
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating revenue:", error);
      return false;
    }
  };

  const handleDelete = (revenue) => {
    setRevenueToDelete(revenue);
    setIsDeleteModalOpen(true);
  };

  // Update confirmDelete function
  const confirmDelete = async () => {
    if (!revenueToDelete?.id) {
      console.error("Invalid revenue ID");
      return;
    }

    try {
      const resultAction = await dispatch(deleteRevenue(revenueToDelete.id));
      if (deleteRevenue.fulfilled.match(resultAction)) {
        const newTotalPages = Math.ceil((revenues.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
        // Close delete modal
        setIsDeleteModalOpen(false);
        setRevenueToDelete(null);

        // Show success modal
        setShowSuccessModal(true);

        // Auto hide success modal after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);

        // Refresh the revenues list
        dispatch(fetchRevenues());
      }
    } catch (error) {
      console.error("Error deleting revenue:", error);
    }
  };
  const totalPages = Math.ceil(revenues.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const paginatedRevenues = revenues
    .filter((revenue) => {
      if (filterProperty !== "all" && revenue.propertyName !== filterProperty) {
        return false;
      }
      if (
        (filterDateFrom && new Date(revenue.date) < new Date(filterDateFrom)) ||
        (filterDateTo && new Date(revenue.date) > new Date(filterDateTo))
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "amount") {
        return a.amount - b.amount;
      } else if (sortBy === "source") {
        return a.source.localeCompare(b.source);
      }
      return 0;
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportClick = (format) => {
    const dataToExport = revenues.map((revenue) => ({
      Amount: revenue.amount,
      Source: revenue.source,
      PropertyId: revenue.propertyId,
      PropertyName: revenue.propertyName,
      PaymentMode: revenue.paymentMode,
      Description: revenue.description,
    }));

    if (format === "excel") {
      exportToExcel(dataToExport);
    } else if (format === "word") {
      exportToWord(dataToExport);
    } else if (format === "pdf") {
      exportToPDF(dataToExport);
    }
  };

  // Export to Excel
  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenues");
    XLSX.writeFile(wb, "Revenue_Report.xlsx");
  };

  // Export to Word
  const exportToWord = (data) => {
    const doc = new docxtemplater();
    doc.loadZip(new JSZip()); // Initialize the docxtemplater with an empty template

    // Add content to the Word file
    doc.setData({
      revenues: data,
    });

    try {
      doc.render();
      const out = doc.getZip().generate({ type: "blob" });
      saveAs(out, "Revenue_Report.docx");
    } catch (error) {
      console.error(error);
    }
  };

  // Export to PDF
  const exportToPDF = (data) => {
    const doc = new jsPDF();

    // Add content to PDF
    doc.autoTable({
      head: [
        [
          "Amount",
          "Source",
          "Property ID",
          "Property Name",
          "Payment Mode",
          "Description",
        ],
      ],
      body: data.map((revenue) => [
        revenue.Amount,
        revenue.Source,
        revenue.PropertyId,
        revenue.PropertyName,
        revenue.PaymentMode,
        revenue.Description,
      ]),
    });

    doc.save("Revenue_Report.pdf");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-white rounded-xl border m-3">
      <div className="p-4 flex flex-wrap gap-4 items-center">
        <h2 className="text-md font-semibold"> Revenues by Property</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Filter Property */}
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-sm text-gray-500">Show Revenue by </label>
            <Select onValueChange={setFilterProperty}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white border border-gray-300 rounded-md">
                <SelectValue placeholder="Select Property" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <SelectItem value="all">All Properties</SelectItem>
                {Array.from(
                  new Set(revenues.map((revenue) => revenue.propertyName))
                ).map((property) => (
                  <SelectItem key={property} value={property}>
                    {property}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From Date */}
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-sm text-gray-500">From Date</label>
            <Input
              type="date"
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full sm:w-[200px]"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-sm text-gray-500">To Date</label>
            <Input
              type="date"
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full sm:w-[200px]"
            />
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <Select onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[100px] h-9 bg-white border border-gray-300 rounded-md mt-6">
                <SelectValue placeholder=" Sort By " />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="source">Source</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export and Add New Revenue Button */}
          <div className="flex gap-4 sm:gap-6 mt-6 sm:mt-0">
            {/* Export Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-[100px] h-9 mt-6"
                >
                  <FileDown className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border border-gray-300 rounded-md shadow-lg z-10"
              >
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

            {/* Add New Revenue Button */}
            <Button
              variant="default"
              className="bg-blue-700 hover:bg-blue-800 text-white mt-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Revenue
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRevenues.map((revenue) => (
              <TableRow key={revenue.id}>
                <TableCell>{revenue.amount}</TableCell>
                <TableCell>{revenue.source}</TableCell>
                <TableCell>{revenue.propertyName}</TableCell>
                <TableCell>{revenue.paymentMode}</TableCell>
                <TableCell>{revenue.description}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpenModal(revenue)} // Pass only revenue id
                    variant="outline"
                    className="mr-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(revenue)}
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Update Revenue Component */}
      {isModalOpen && selectedRevenue && (
        <UpdateRevenue
          revenueId={selectedRevenue.id}
          initialValues={selectedRevenue}
          onSubmit={handleUpdateRevenue}
          onCancel={handleCloseModal}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
            <MdCheckCircle className="text-green-500 text-4xl mx-auto mb-2" />
            <h3 className="text-xl font-semibold text-center mb-2">Success!</h3>
            <p className="text-center">Revenue deleted successfully!</p>
          </div>
        </div>
      )}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRevenueToDelete(null);
        }}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this revenue?"
      />
    </div>
  );
};

export default AdminRevenueTable;
