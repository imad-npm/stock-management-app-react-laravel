import React from 'react';

/**
 * A reusable Table component for displaying tabular data.
 * @param {object} props
 * @param {Array<object>} props.data - An array of objects, where each object represents a row.
 * @param {Array<{header: string, accessor: string, Cell?: (row: object) => React.ReactNode, truncate?: boolean}>} props.columns - An array of column definitions.
 */
function Table({ data, columns }) {
    if (!data || data.length === 0) {
        return <p className="text-center py-4 text-secondary">No data to display.</p>;
    }

    // 🔑 Helper pour lire les valeurs imbriquées (ex: "product.title")
    const getValue = (obj, path) =>
        path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);

    return (
        <div className="shadow-lg border-b border-light-gray ">
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-light-gray">
                    <thead className="bg-background">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={column.accessor || index}
                                    scope="col"
                                    className="px-5 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-light-gray">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className="hover:bg-light-gray transition duration-150 ease-in-out"
                            >
                                {columns.map((column, colIndex) => {
                                    const value = column.Cell
                                        ? column.Cell(row)
                                        : getValue(row, column.accessor);

                                    return (
                                        <td
                                            key={column.accessor || colIndex}
                                            className={`px-5 py-4 whitespace-nowrap text-sm text-text ${
                                                column.truncate ? 'truncate max-w-xs' : ''
                                            }`}
                                        >
                                            {value}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
