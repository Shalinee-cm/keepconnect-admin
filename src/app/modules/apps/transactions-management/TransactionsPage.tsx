import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'

type Transaction = {
  id: number
  transactionName: string
  createdAt: string
}

const TransactionsPage: React.FC = () => {
  const transactionsData: Transaction[] = [
    { id: 1, transactionName: 'Payment - Invoice #1001', createdAt: '2025-09-12' },
    { id: 2, transactionName: 'Refund - Invoice #1002', createdAt: '2025-10-01' },
    { id: 3, transactionName: 'Payment - Subscription', createdAt: '2025-10-15' },
    { id: 4, transactionName: 'Adjustment - Credit', createdAt: '2025-11-02' },
    { id: 5, transactionName: 'Payment - Order #2023', createdAt: '2025-11-04' },
    { id: 6, transactionName: 'Refund - Order #2022', createdAt: '2025-09-29' },
    { id: 7, transactionName: 'Payment - Renewal', createdAt: '2025-10-10' },
    { id: 8, transactionName: 'Chargeback', createdAt: '2025-08-22' },
    { id: 9, transactionName: 'Payment - Invoice #1010', createdAt: '2025-09-05' },
    { id: 10, transactionName: 'Refund - Invoice #1011', createdAt: '2025-11-06' },
  ]

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 5

  const filteredData = useMemo(() => {
    return transactionsData.filter((item) =>
      item.transactionName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [transactionsData, searchTerm])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage]
  )

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        header: 'Transaction Name',
        accessorKey: 'transactionName',
        cell: (info) => (
          <span className='fw-semibold text-dark'>
            {info.getValue() as string}
          </span>
        ),
      },
      {
        header: 'Created Date',
        accessorKey: 'createdAt',
        cell: (info) => (
          <span className='text-muted'>
            {info.getValue() as string}
          </span>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: (info) => {
          const transaction = info.row.original
          return (
            <div className='d-flex justify-content-end gap-2'>
              <button
                className='btn btn-sm btn-light-primary px-3'
                onClick={() => alert(`Edit: ${transaction.transactionName}`)}
              >
                <i className='bi bi-pencil-square'></i> Edit
              </button>
              <button
                className='btn btn-sm btn-light-danger px-3'
                onClick={() => alert(`Delete: ${transaction.transactionName}`)}
              >
                <i className='bi bi-trash'></i> Delete
              </button>
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='container-fluid mt-15' style={{ maxWidth: '95%' }}>
      {/* 🔹 Page Title */}
      <div
        className='d-flex align-items-center justify-content-start mb-5'
        style={{
          borderRadius: '8px',
          padding: '10px 20px',
          color: '#fff',
        }}
      >
        <h1
          className='fw-bold mb-0'
          style={{
            fontSize: '1.2rem',
            letterSpacing: '0.3px',
            color: '#fff',
          }}
        >
          Transaction-Management
        </h1>
      </div>

      {/* 🔹 Table Card */}
      <div
        className='py-5'
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          padding: '60px',
        }}
      >
        {/* Header Row with Title and Search */}
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h4 className='fw-bold text-primary mb-0'>Transactions</h4>

          {/* 🔍 Search bar (Top-right of table) */}
          <div
            className='d-flex align-items-center px-3 py-1 shadow-sm'
            style={{
              backgroundColor: '#f5f8fa',
              borderRadius: '5px',
              border: '1px solid #e1e3ea',
              width: '180px',
              transition: 'all 0.3s ease',
            }}
          >
            <i className='bi bi-search text-muted me-2'></i>
            <input
              type='text'
              className='form-control border-0 bg-transparent'
              placeholder='Search transactions...'
              style={{ outline: 'none', boxShadow: 'none', fontSize: '0.9rem' }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className='table-responsive'>
          <table className='table table-hover align-middle'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className='text-muted text-uppercase fs-7 border-bottom'
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`py-3 ${
                        header.column.id === 'actions' ? 'text-end pe-3' : ''
                      }`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className='fw-semibold'>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`${
                          cell.column.id === 'actions' ? 'text-end pe-3' : ''
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className='text-center py-5 text-muted'
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='d-flex justify-content-between align-items-center mt-4'>
          <span className='text-muted'>
            Page {currentPage} of {totalPages}
          </span>
          <div>
            <button
              className='btn btn-sm btn-light me-2'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <button
              className='btn btn-sm btn-primary'
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionsPage
