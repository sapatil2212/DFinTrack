import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, setError } from "../../../slices/expensesSlice";
import ExpenseService from "../../../services/ExpenseService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";

const AddExpense = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    propertyId: user.propertyId,
  });
  const [formErrors, setFormErrors] = useState({
    description: false,
    amount: false,
    category: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {
      description: !formData.description,
      amount: !formData.amount,
      category: !formData.category,
    };

    setFormErrors(errors);

    if (Object.values(errors).includes(true)) {
      return; // Prevent form submission if there are validation errors
    }

    setSubmitting(true);

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      const response = await ExpenseService.createExpense(expenseData);
      dispatch(addExpense(response));
      setShowSuccess(true);

      setTimeout(() => {
        setFormData({
          description: "",
          amount: "",
          category: "",
          propertyId: user.propertyId,
        });
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      dispatch(setError(err.message || "Error adding expense"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    open && (
      // Dialog container with background overlay
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
        {/* Dialog box */}
        <div className="bg-white w-full sm:max-w-[300px] md:max-w-[400px] lg:max-w-[600px] xl:max-w-[600px] 2xl:max-w-[450px] rounded-lg shadow-lg p-6">
          {/* Dialog Header */}
          <div className="flex flex-col justify-between items-start mb-4">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-lg sm:text-sm md:text-md lg:text-lg font-semibold">
                Add New Expense
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                X
              </button>
            </div>
            {/* Paragraph and Horizontal Line */}
            <p className="text-xs sm:text-sm md:text-md lg:text-xs text-gray-500 mt-2">
              Please fill in the details below to add a new expense.
            </p>
            <hr className="w-full mt-2 border-t border-gray-300" />
          </div>
          {showSuccess ? (
            <Alert className="bg-green-50 border-green-200">
              <Check className="w-4 h-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Expense added successfully!
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter expense description"
                    required
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-1 ${
                      formErrors.description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    required
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-1 ${
                      formErrors.amount
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    placeholder="Enter category"
                    required
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-1 ${
                      formErrors.category
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Adding..." : "Add Expense"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  );
};

export default AddExpense;
