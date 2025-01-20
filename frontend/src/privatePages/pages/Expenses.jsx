import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  FileSpreadsheet,
  FileText,
  FileIcon as FilePdf,
  FileDown,
} from "lucide-react";
import { setExpenses, setLoading, setError } from "../../slices/expensesSlice";
import ExpenseService from "../../services/ExpenseService";
import ExpenseList from "../../privatePages/pages/ExpenseComp/ExpenseList";
import AddExpense from "../../privatePages/pages/ExpenseComp/AddExpense";
import EditExpense from "../../privatePages/pages/ExpenseComp/EditExpense";
import DeleteExpense from "../../privatePages/pages/ExpenseComp/DeleteExpense";
import ViewExpense from "../../privatePages/pages/ExpenseComp/ViewExpense";
import StatisticsCard from "../../privatePages/pages/ExpenseComp/StatisticsCard";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, Table, TableCell, TableRow } from "docx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";

const ExpenseDashboard = () => {
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector((state) => state.expenses);
  const user = useSelector((state) => state.user);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [expenseToView, setExpenseToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterProperty, setFilterProperty] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState(null);
  const [exportProperty, setExportProperty] = useState("all");
  const [exportLoading, setExportLoading] = useState(false);
  const [exportDateFrom, setExportDateFrom] = useState("");
  const [exportDateTo, setExportDateTo] = useState("");
  const [exportMonth, setExportMonth] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, [user.id]);

  const fetchExpenses = async () => {
    try {
      dispatch(setLoading(true));
      const response =
        user.accountType === "ADMIN"
          ? await ExpenseService.getAllExpenses()
          : await ExpenseService.getExpenses();
      dispatch(setExpenses(Array.isArray(response) ? response : []));
    } catch (err) {
      dispatch(setError(err.message || "Error fetching expenses"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleExportClick = (format) => {
    setSelectedExportFormat(format);
    setShowPropertyDialog(true);
  };

  const handleExportConfirm = () => {
    setShowPropertyDialog(false);
    setShowExportDialog(true);
  };

  const getExportData = () => {
    let filteredData =
      exportProperty === "all"
        ? filteredExpenses
        : filteredExpenses.filter(
            (expense) => expense.propertyName === exportProperty
          );

    if (exportMonth) {
      const [year, month] = exportMonth.split("-");
      filteredData = filteredData.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getFullYear() === parseInt(year) &&
          expenseDate.getMonth() === parseInt(month) - 1
        );
      });
    } else if (exportDateFrom && exportDateTo) {
      filteredData = filteredData.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= new Date(exportDateFrom) &&
          expenseDate <= new Date(exportDateTo)
        );
      });
    }

    return formatExpenseData(filteredData);
  };

  const formatExpenseData = (expenses) => {
    return expenses.map((expense) => ({
      Description: expense.description,
      Amount:
        typeof expense.amount === "number"
          ? expense.amount.toFixed(2)
          : expense.amount,
      Date: new Date(expense.date).toLocaleDateString(),
      Category: expense.category,
      Property: expense.propertyName,
      CreatedBy: expense.createdBy,
    }));
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      const fileName = `expense_report_${
        new Date().toISOString().split("T")[0]
      }`;
      const data = getExportData();

      switch (format) {
        case "excel": {
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Expenses");
          XLSX.writeFile(wb, `${fileName}.xlsx`);
          break;
        }
        case "word": {
          const doc = new Document({
            sections: [
              {
                properties: {},
                children: [
                  new Paragraph({
                    text: "Expense Report",
                    heading: "Heading1",
                  }),
                  new Table({
                    rows: [
                      new TableRow({
                        children: Object.keys(data[0]).map(
                          (key) =>
                            new TableCell({
                              children: [
                                new Paragraph({ text: key, bold: true }),
                              ],
                            })
                        ),
                      }),
                      ...data.map(
                        (row) =>
                          new TableRow({
                            children: Object.values(row).map(
                              (value) =>
                                new TableCell({
                                  children: [new Paragraph(value.toString())],
                                })
                            ),
                          })
                      ),
                    ],
                  }),
                ],
              },
            ],
          });
          const blob = await Packer.toBlob(doc);
          saveAs(blob, `${fileName}.docx`);
          break;
        }
        case "pdf": {
          const pdf = new jsPDF();
          pdf.autoTable({
            head: [Object.keys(data[0])],
            body: data.map(Object.values),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] },
          });
          pdf.save(`${fileName}.pdf`);
          break;
        }
      }
    } catch (error) {
      console.error("Export failed:", error);
      dispatch(setError("Failed to export data"));
    } finally {
      setExportLoading(false);
      setShowExportDialog(false);
    }
  };

  const handleDelete = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
    setIsEditDialogOpen(true);
  };

  const handleView = (expense) => {
    setExpenseToView(expense);
    setIsViewDialogOpen(true);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesProperty =
      filterProperty === "all" ||
      !filterProperty ||
      expense.propertyName === filterProperty;
    const expenseDate = new Date(expense.date);
    const matchesDateFrom =
      !filterDateFrom || expenseDate >= new Date(filterDateFrom);
    const matchesDateTo =
      !filterDateTo || expenseDate <= new Date(filterDateTo);
    return matchesProperty && matchesDateFrom && matchesDateTo;
  });

  const currentItems = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="w-full bg-white border rounded-lg">
        <div className="flex flex-row items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold">
            {user.accountType === "ADMIN" ? "All Expenses" : "My Expenses"}
          </h1>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2 border border-xs"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>

        <div className="p-4 flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">Show Expense by </label>
              <Select onValueChange={setFilterProperty}>
                <SelectTrigger className="w-[200px] bg-white border border-gray-300 rounded-md">
                  <SelectValue placeholder="Select Property" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <SelectItem value="all">All Properties</SelectItem>
                  {Array.from(
                    new Set(expenses.map((expense) => expense.propertyName))
                  ).map((property) => (
                    <SelectItem key={property} value={property}>
                      {property}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={!filteredExpenses.length || exportLoading}
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
          </div>
        </div>

        <div className="p-4">
          <StatisticsCard
            expenses={filteredExpenses}
            isAdmin={user.accountType === "ADMIN"}
          />
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : filteredExpenses.length > 0 ? (
            <ExpenseList
              expenses={currentItems}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleView}
              isAdmin={user.accountType === "ADMIN"}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          ) : (
            <div className="text-center py-4 text-gray-500">
              No expenses found
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={showPropertyDialog}
        onOpenChange={setShowPropertyDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Options</AlertDialogTitle>
            <AlertDialogDescription>
              Choose export options:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <Select value={exportProperty} onValueChange={setExportProperty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Property" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border border-gray-300">
                <SelectItem value="all" className="hover:bg-gray-100">
                  All Properties
                </SelectItem>
                {Array.from(
                  new Set(expenses.map((expense) => expense.propertyName))
                ).map((property) => (
                  <SelectItem
                    key={property}
                    value={property}
                    className="hover:bg-gray-100"
                  >
                    {property}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <div className="mt-1 flex space-x-2">
                <Input
                  type="date"
                  value={exportDateFrom}
                  onChange={(e) => setExportDateFrom(e.target.value)}
                  className="w-1/2"
                  placeholder="From"
                />
                <Input
                  type="date"
                  value={exportDateTo}
                  onChange={(e) => setExportDateTo(e.target.value)}
                  className="w-1/2"
                  placeholder="To"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Or Select Month
              </label>
              <Input
                type="month"
                value={exportMonth}
                onChange={(e) => setExportMonth(e.target.value)}
                className="w-full mt-1"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExportConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Export {exportProperty === "all" ? "all" : exportProperty}{" "}
              property expenses
              {exportMonth
                ? ` for ${new Date(exportMonth).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}`
                : exportDateFrom && exportDateTo
                ? ` from ${new Date(
                    exportDateFrom
                  ).toLocaleDateString()} to ${new Date(
                    exportDateTo
                  ).toLocaleDateString()}`
                : ""}{" "}
              in {selectedExportFormat?.toUpperCase()} format?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleExport(selectedExportFormat)}
              disabled={exportLoading}
            >
              Export
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddExpense
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={fetchExpenses}
      />

      <EditExpense
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        expense={expenseToEdit}
        onSuccess={fetchExpenses}
      />

      <DeleteExpense
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        expense={expenseToDelete}
        onSuccess={fetchExpenses}
      />

      <ViewExpense
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        expense={expenseToView}
      />
    </div>
  );
};

export default ExpenseDashboard;
