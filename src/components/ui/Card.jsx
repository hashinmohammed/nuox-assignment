export default function Card({
  children,
  className = "",
  title = null,
  ...props
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-lg shadow-md p-6 ${className}`}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
