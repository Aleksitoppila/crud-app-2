import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PROJECT_COLUMNS } from './columns';
import { ColumnFilter } from './filters';
import { CreateProject } from './createProject';
import './table.css';

export const ProjectTable = () => {
    const [projects, setProjects] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjectList = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setErrorMessage('No token found. Please log in first.');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('/api/prj/getall', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching project list:', error);
                if (error.response && error.response.status === 401) {
                    setErrorMessage('Session expired. Please log in again.');
                    navigate('/login');
                } else {
                    setErrorMessage('Failed to fetch projects. Please try again.');
                }
            }
        };

        fetchProjectList();
    }, [navigate]);

    const columns = useMemo(() => PROJECT_COLUMNS, []);
    const data = useMemo(() => projects, [projects]);

    const defaultColumn = useMemo(() => ({
        Filter: ColumnFilter
    }), []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        prepareRow,
        state,
    } = useTable({
        columns,
        data,
        defaultColumn,
        initialState: { pageIndex: 0 },
    },
        useFilters,
        useSortBy,
        usePagination);

    const { pageIndex, pageSize } = state;

    return (
        <>
            {errorMessage && (
                <div className="p-2 mb-4 text-white bg-red-500 rounded-md error-message">
                    {errorMessage}
                </div>
            )}
            <div className="flex items-center py-1">
                <div className="flex ml-auto mr-3">
                    <CreateProject />
                </div>
            </div>
            <div className="mx-auto justify-center max-h-[700px] overflow-auto">
                <table {...getTableProps()} className="w-full text-sm text-zinc-900">
                    <thead className="sticky top-0 z-20 text-white">
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={ headerGroup.id }>
                                {headerGroup.headers.map(column => (
                                    <th className="bg-teal-600" key={ column.id }>
                                        <div className="flex items-center justify-between pl-2">
                                            {column.render('Header')}
                                            {column.canFilter ? column.render('Filter') : null}
                                            <div
                                                {...column.getHeaderProps(column.getSortByToggleProps())} className="items-center ml-5 text-2xl" key={projects._id}>
                                                <button className="pt-1 pl-1 pr-1 text-sm align-text-top">
                                                    {' '}
                                                    {column.isSorted ? (column.isSortedDesc ? <i className="fi fi-rr-sort-amount-up-alt" /> : <i className="fi fi-rr-sort-amount-down" />) : <i className="fi fi-rs-sort-alt" />}
                                                </button>
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={row.id || row.index }>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className="px-2 py-1 max-w-96" key={cell.column.id}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-center mx-auto my-2 text-xs text-white select-none pages sm:text-sm md:text-md">
                <span>
                    Pages
                    <strong className="ml-3">
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
                <span className="mx-2">|</span>
                <span>
                    Go to page:
                    <input type='number' defaultValue={pageIndex + 1}
                        onChange={e => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(pageNumber);
                        }} className="w-12 pl-1 ml-3 text-zinc-900 sm:w-12 md:w-16 focus:outline-none"
                    />
                </span>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="ml-2">
                    <i className="flex align-top fi fi-rr-arrow-alt-to-left" />
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage} className="ml-2">
                    Previous
                </button>
                <span className="mx-1"></span>
                <button onClick={() => nextPage()} disabled={!canNextPage} className="mr-2">
                    Next
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="mr-2">
                    <i className="flex align-top fi fi-rr-arrow-alt-to-right" />
                </button>
                <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="cursor-pointer text-zinc-900 focus:outline-none">
                    {[5, 10, 25, 50, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};
