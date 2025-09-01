import React from 'react';
import { Edit, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';

const Table = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView, 
  onSort,
  sortField,
  sortDirection,
  className = '' 
}) => {
  const handleSort = (key) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div className={`overflow-x-auto rounded-lg border border-blue-200 ${className}`}>
      <table className="min-w-full bg-white">
        <thead className="bg-blue-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer"
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && (
                    <span className="ml-1">
                      {sortField === column.key ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <div className="w-4 h-4"></div>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {(onEdit || onDelete || onView) && (
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-blue-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onView) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {onView && (
                        <button 
                          onClick={() => onView(row)} 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(row)} 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(row)} 
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length + ((onEdit || onDelete || onView) ? 1 : 0)} 
                className="px-6 py-4 text-center text-sm text-blue-600"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;