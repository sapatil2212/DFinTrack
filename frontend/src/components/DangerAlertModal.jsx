import React, { useState } from "react";

const DangerAlertModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="text-center">
      {/* Open Modal Button */}
      <button
        type="button"
        onClick={toggleModal}
        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="danger-alert-modal"
      >
        Open Modal
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          id="danger-alert-modal"
          className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto bg-black/50 flex justify-center items-center"
          role="dialog"
          tabIndex="-1"
          aria-labelledby="danger-alert-label"
        >
          <div className="relative bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-800 w-full max-w-md mx-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={toggleModal}
              className="absolute top-2 right-2 inline-flex justify-center items-center w-8 h-8 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none dark:bg-neutral-700 dark:hover:bg-neutral-600"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-4 sm:p-10 overflow-y-auto">
              <div className="flex gap-x-4 md:gap-x-7">
                {/* Icon */}
                <span className="shrink-0 inline-flex justify-center items-center w-12 h-12 rounded-full border-4 border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                </span>
                {/* End Icon */}

                <div className="grow">
                  <h3
                    id="danger-alert-label"
                    className="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200"
                  >
                    Delete Personal Account
                  </h3>
                  <p className="text-gray-500 dark:text-neutral-500">
                    Permanently remove your Personal Account and all of its
                    contents from the platform. This action is not reversible,
                    so please proceed with caution.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-neutral-950 dark:border-neutral-800">
              <button
                type="button"
                onClick={toggleModal}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none dark:bg-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <a
                href="#"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600"
              >
                Delete Personal Account
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerAlertModal;
