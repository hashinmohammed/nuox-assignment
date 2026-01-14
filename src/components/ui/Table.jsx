export default function Table({ columns, data, onRowClick = null }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 sm:px-6 py-6 sm:py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={
                    onRowClick
                      ? "hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors duration-150"
                      : ""
                  }
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-gray-300"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
