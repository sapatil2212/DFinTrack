import React, { useState, useRef, useEffect } from "react";
import { deleteExpense, setError } from "../../../slices/expensesSlice";
import ExpenseService from "../../../services/ExpenseService";
import { useDispatch } from "react-redux";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const DeleteExpense = ({ open, onClose, expense, onDelete }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  if (!open) {
    return null;
  }

  const handleDelete = async () => {
    if (!expense?.id) {
      console.error("Invalid expense ID");
      return;
    }

    try {
      setIsDeleting(true);
      setStatus({ type: null, message: "" });

      await ExpenseService.deleteExpense(expense.id);
      dispatch(deleteExpense(expense.id));

      setStatus({
        type: "success",
        message: "Expense deleted successfully!",
      });

      setTimeout(() => {
        onDelete(expense.id);
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage = err.message || "Error deleting expense";
      dispatch(setError(errorMessage));
      setStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-labelledby="delete-modal-title"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        <div
          ref={modalRef}
          className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all"
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="absolute top-2.5 right-2.5 rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
            disabled={isDeleting}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

          <h2
            id="delete-modal-title"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Confirm Deletion
          </h2>

          {status.type && (
            <div
              className={`mt-4 rounded-lg p-3 ${
                status.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
              role="alert"
            >
              <div className="flex items-center justify-center gap-2">
                {status.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-5 w-5" aria-hidden="true" />
                )}
                <span>{status.message}</span>
              </div>
            </div>
          )}

          <p className="mt-4 text-gray-500">
            Are you sure you want to delete this expense?
          </p>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Deleting...</span>
                </>
              ) : (
                "Delete Expense"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteExpense;
