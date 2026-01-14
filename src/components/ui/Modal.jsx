export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
        <div
          className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-xl ${sizes[size]} w-full mx-2 sm:mx-0`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white pr-8">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 dark:text-gray-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
