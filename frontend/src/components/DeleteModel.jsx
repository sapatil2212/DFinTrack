import React, { useState, useRef } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { MdCheckCircle } from "react-icons/md";

const DeleteModal = ({ open, onClose, onConfirm, message }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  if (!open) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (err) {
      console.error("Error deleting revenue:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        <div
          ref={modalRef}
          className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all"
        >
          {/* Close button */}
          <button
            ref={closeButtonRef}
            type="button"
            className="absolute top-2.5 right-2.5 rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900"
            onClick={onClose}
            disabled={isDeleting}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <h2 className="text-lg font-medium text-gray-900">
            Confirm Deletion
          </h2>

          <p className="mt-4 text-gray-500">{message}</p>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Revenue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
