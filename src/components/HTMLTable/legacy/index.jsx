import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const getValueByPath = (obj, path, defaultValue = '-') => {
    const value = path
        ?.split('.')
        ?.reduce((current, key) => current?.[key], obj);

    return value ?? defaultValue;
};

const normalizeTableData = (data) => {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.records)) return data.records;

    return [];
};

const InconelHTMLTable = ({
    columns = [],
    data = [],
    rowKey = 'id',
    selectable = false,
    pagination = true,
    pageSize = 10,
    pageSizeOptions = [5, 10, 20, 30, 50, 100],
    total,
    currentPage,
    className = '',
    rowClassName,
    onRowClick,
    onPageChange,
    onPageSizeChange,
    onSelectionChange
}) => {
    const [sortConfig, setSortConfig] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedPageSize, setSelectedPageSize] = useState(pageSize);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setSelectedPageSize(pageSize);
    }, [pageSize]);

    const tableData = useMemo(() => normalizeTableData(data), [data]);

    const sortedData = useMemo(() => {
        if (!sortConfig) return tableData;

        return [...tableData].sort((a, b) => {
            const aVal = getValueByPath(a, sortConfig.key, '');
            const bVal = getValueByPath(b, sortConfig.key, '');

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [tableData, sortConfig]);

    const activePage = currentPage ?? page;
    const hasTotal = total !== undefined && total !== null;
    const isServerSidePagination = hasTotal && typeof onPageChange === 'function';
    const totalPage = Math.ceil((hasTotal ? total : sortedData.length) / selectedPageSize);

    const visibleData = pagination && !isServerSidePagination
        ? sortedData.slice((activePage - 1) * selectedPageSize, activePage * selectedPageSize)
        : sortedData;

    const getRowKey = (row, rowIndex) => (
        getValueByPath(row, rowKey, rowIndex)
    );

    const handleSort = (column) => {
        if (!column.sortable) return;

        setSortConfig((prev) => {
            if (prev?.key === column.key) {
                return {
                    key: column.key,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc'
                };
            }

            return {
                key: column.key,
                direction: 'asc'
            };
        });
    };

    const handleSelect = (row, rowIndex) => {
        const key = getRowKey(row, rowIndex);

        const newSelectedRows = selectedRows.includes(key)
            ? selectedRows.filter((item) => item !== key)
            : [...selectedRows, key];

        setSelectedRows(newSelectedRows);
        onSelectionChange?.(newSelectedRows);
    };

    const handleSelectAll = () => {
        const visibleKeys = visibleData.map((row, rowIndex) => getRowKey(row, rowIndex));
        const allSelected = visibleKeys.every((key) => selectedRows.includes(key));

        const newSelectedRows = allSelected
            ? selectedRows.filter((key) => !visibleKeys.includes(key))
            : [...new Set([...selectedRows, ...visibleKeys])];

        setSelectedRows(newSelectedRows);
        onSelectionChange?.(newSelectedRows);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPage || newPage === activePage) return;

        if (currentPage === undefined || currentPage === null) {
            setPage(newPage);
        }

        onPageChange?.(newPage);
    };

    const handlePageSizeChange = (event) => {
        const newPageSize = Number(event.target.value);

        setSelectedPageSize(newPageSize);

        if (currentPage === undefined || currentPage === null) {
            setPage(1);
        }

        if (typeof onPageSizeChange === 'function') {
            onPageSizeChange(newPageSize);
            return;
        }

        onPageChange?.(1);
    };

    const getPaginationItems = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPage <= maxVisiblePages + 2) {
            return Array.from({ length: totalPage }, (_, index) => index + 1);
        }

        const startPage = Math.max(2, activePage - 1);
        const endPage = Math.min(totalPage - 1, activePage + 1);

        pages.push(1);

        if (startPage > 2) {
            pages.push('...');
        }

        for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
            pages.push(pageNumber);
        }

        if (endPage < totalPage - 1) {
            pages.push('...');
        }

        pages.push(totalPage);

        return pages;
    };

    return (
        <div
            className={[
                'ep-table-wrapper',
                isScrolled ? 'is-scrolled' : '',
                className
            ]
                .filter(Boolean)
                .join(' ')}
            onScroll={(event) => {
                setIsScrolled(event.currentTarget.scrollTop > 0);
            }}
        >
            <table className="table table-bordered">
                <thead>
                    <tr>
                        {selectable && (
                            <th className="ep-table-check">
                                <input type="checkbox" onChange={handleSelectAll} />
                            </th>
                        )}

                        {columns.map((column) => (
                            <th
                                key={column.key}
                                onClick={() => handleSort(column)}
                                className={`${column.sortable ? 'sortable' : ''} ${column.headerClassName || ''}`}
                            >
                                {column.title}

                                {sortConfig?.key === column.key && (
                                    <span>
                                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                                    </span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {visibleData.length > 0 ? (
                        visibleData.map((row, rowIndex) => {
                            const key = getRowKey(row, rowIndex);
                            const rowClass = typeof rowClassName === 'function'
                                ? rowClassName(row, rowIndex)
                                : rowClassName;

                            return (
                                <tr
                                    key={key}
                                    onClick={() => onRowClick?.(row)}
                                    className={[
                                        onRowClick ? 'clickable' : '',
                                        rowClass
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                >
                                    {selectable && (
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(key)}
                                                onChange={() => handleSelect(row, rowIndex)}
                                            />
                                        </td>
                                    )}

                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={column.className || ''}
                                        >
                                            {column.render
                                                ? column.render(row, rowIndex)
                                                : getValueByPath(row, column.key)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length + (selectable ? 1 : 0)}>
                                Kayıt bulunamadı
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {pagination && totalPage > 1 && (
                <div className="ep-table-pagination">
                    <button type="button" disabled={activePage === 1} onClick={() => handlePageChange(activePage - 1)}>
                        Geri
                    </button>

                    {getPaginationItems().map((item, index) => (
                        item === '...' ? (
                            <span key={`pagination-ellipsis-${index}`}>...</span>
                        ) : (
                            <button
                                type="button"
                                key={`pagination-page-${item}`}
                                className={item === activePage ? 'active' : ''}
                                onClick={() => handlePageChange(item)}
                            >
                                {item}
                            </button>
                        )
                    ))}

                    <button type="button" disabled={activePage === totalPage} onClick={() => handlePageChange(activePage + 1)}>
                        İleri
                    </button>

                    <button type="button" disabled={activePage === totalPage} onClick={() => handlePageChange(totalPage)}>
                        Son Sayfa
                    </button>

                    <select value={selectedPageSize} onChange={handlePageSizeChange}>
                        {pageSizeOptions.map((option) => (
                            <option key={`page-size-${option}`} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

InconelHTMLTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.node
            ]),
            sortable: PropTypes.bool,
            render: PropTypes.func,
            headerClassName: PropTypes.string,
            className: PropTypes.string
        })
    ),
    data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.shape({
            items: PropTypes.arrayOf(PropTypes.object),
            data: PropTypes.arrayOf(PropTypes.object),
            content: PropTypes.arrayOf(PropTypes.object),
            records: PropTypes.arrayOf(PropTypes.object)
        })
    ]),
    rowKey: PropTypes.string,
    selectable: PropTypes.bool,
    pagination: PropTypes.bool,
    pageSize: PropTypes.number,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
    total: PropTypes.number,
    currentPage: PropTypes.number,
    onRowClick: PropTypes.func,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onSelectionChange: PropTypes.func,
    rowClassName: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),
    className: PropTypes.string
};

export default InconelHTMLTable;
