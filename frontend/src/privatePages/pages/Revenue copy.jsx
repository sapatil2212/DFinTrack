import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import RevenueChart from "./DashboardHomeComp/RevenueChart";
const Revenue = ({
  expenses = [
    {
      id: 1,
      description: "Office Rent",
      amount: 1200,
      date: "2024-01-01",
      category: "Rent",
      propertyName: "Main Office",
      createdBy: "Admin",
    },
    {
      id: 2,
      description: "Internet Bill",
      amount: 150,
      date: "2024-01-05",
      category: "Utilities",
      propertyName: "Main Office",
      createdBy: "Admin",
    },
    {
      id: 3,
      description: "Office Supplies",
      amount: 200,
      date: "2024-01-10",
      category: "Supplies",
      propertyName: "Main Office",
      createdBy: "Admin",
    },
    {
      id: 4,
      description: "Employee Salaries",
      amount: 5000,
      date: "2024-01-15",
      category: "Salary",
      propertyName: "Main Office",
      createdBy: "Admin",
    },
  ], // Default dummy data
  onEdit,
  onDelete,
  onView,
  isAdmin,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <RevenueChart />
      </div>
      <div className="w-full bg-white border rounded-lg p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Property Name</TableHead>
              {isAdmin && <TableHead>Created By</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>${expense.amount}</TableCell>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.propertyName}</TableCell>
                {isAdmin && <TableCell>{expense.createdBy}</TableCell>}
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onView(expense)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(expense)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(expense)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
