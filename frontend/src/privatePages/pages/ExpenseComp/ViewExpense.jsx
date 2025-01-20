// ViewExpense.jsx
import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const ViewExpense = ({ open, onClose, expense }) => {
  if (!open || !expense) return null;

  const details = [
    { label: "ID", value: expense.id },
    { label: "Description", value: expense.description },
    { label: "Amount", value: `$${expense.amount}` },
    { label: "Date", value: new Date(expense.date).toLocaleDateString() },
    { label: "Category", value: expense.category },
    { label: "Property Name", value: expense.propertyName },
    { label: "Created By", value: expense.createdBy },
    { label: "Notes", value: expense.notes },
    {
      label: "Created At",
      value: new Date(expense.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">Expense Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="p-6">
          <Table>
            <TableBody>
              {details.map(
                ({ label, value }) =>
                  value && (
                    <TableRow key={label}>
                      <TableCell className="font-medium w-1/3">
                        {label}
                      </TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end p-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default ViewExpense;
