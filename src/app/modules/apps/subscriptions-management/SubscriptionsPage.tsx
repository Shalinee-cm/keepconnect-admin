import React, { useMemo, useState } from 'react'
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table'

type Subscription = {
  id: number
  planName: string
  slug: string
}

const initialData: Subscription[] = [
  { id: 1, planName: 'Basic Plan', slug: 'basic-plan' },
  { id: 2, planName: 'Pro Plan', slug: 'pro-plan' },
  { id: 3, planName: 'Enterprise Plan', slug: 'enterprise-plan' },
  { id: 4, planName: 'Startup Plan', slug: 'startup-plan' },
  { id: 5, planName: 'Premium Plan', slug: 'premium-plan' },
  { id: 6, planName: 'Advanced Plan', slug: 'advanced-plan' },
  { id: 7, planName: 'Team Plan', slug: 'team-plan' },
  { id: 8, planName: 'Solo Plan', slug: 'solo-plan' },
  { id: 9, planName: 'Unlimited Plan', slug: 'unlimited-plan' },
  { id: 10, planName: 'Trial Plan', slug: 'trial-plan' },
  { id: 11, planName: 'Business Plan', slug: 'business-plan' },
  { id: 12, planName: 'Ultimate Plan', slug: 'ultimate-plan' },
]

export const SubscriptionsPage: React.FC = () => {
  const [data, setData] = useState<Subscription[]>(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // 🔍 Filter Data
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  // Actions
  const handleEdit = (plan: Subscription) => {
    alert(`Editing subscription: ${plan.planName}`)
  }

  const handleDelete = (plan: Subscription) => {
    if (window.confirm(`Are you sure you want to delete ${plan.planName}?`)) {
      setData((prev) => prev.filter((item) => item.id !== plan.id))
    }
  }

  // Columns
  const columns = useMemo<ColumnDef<Subscription>[]>(
    () => [
      {
        header: 'Subscription Plan',
        accessorKey: 'planName',
        cell: (info) => (
          <span className='fw-semibold text-dark'>{info.getValue() as string}</span>
        ),
      },
      {
        header: 'Slug',
        accessorKey: 'slug',
        cell: (info) => <span className='text-muted'>{info.getValue() as string}</span>,
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: (info) => {
          const plan = info.row.original
          return (
            <div className='d-flex justify-content-end gap-2'>
              <button
                className='btn btn-sm btn-light-primary px-3'
                onClick={() => handleEdit(plan)}
              >
                <i className='bi bi-pencil-square'></i> Edit
              </button>
              <button
                className='btn btn-sm btn-light-danger px-3'
                onClick={() => handleDelete(plan)}
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
    <div className='container-fluid mt-15'>
      {/* ✅ Page Header */}
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
          Subscription Management
        </h1>
      </div>

      {/* ✅ Main Card/Table Section */}
      <div
        className='py-5'
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          maxWidth: '95%',
          margin: '0 auto',
          padding: '60px',
        }}
      >
        {/* Header Row: Title + Search */}
        <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3'>
          <h4 className='fw-bold text-primary mb-0'>Subscriptions</h4>

          {/* 🔍 Oval Search Bar */}
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
              placeholder='Search subscriptions...'
              style={{
                outline: 'none',
                boxShadow: 'none',
                fontSize: '0.9rem',
              }}
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
                        header.column.id === 'actions' ? 'text-end pe-3' : 'ps-2'
                      }`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
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
                          cell.column.id === 'actions' ? 'text-end pe-3' : 'ps-2'
                        }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className='text-center py-5 text-muted'>
                    No subscriptions found.
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

export default SubscriptionsPage
