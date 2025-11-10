import React, { useMemo, useState } from 'react'
import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import { UserEditModalForm } from './users-list/user-edit-modal/UserEditModalForm'

// 🔹 Breadcrumbs
const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'User Management',
    path: '/apps/user-management/users',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

// 🔹 Type definition
type User = {
  id: number
  fullName: string
  email: string
  role: string
}

const UsersListWrapper: React.FC = () => {
  const usersData: User[] = [
    { id: 1, fullName: 'John Carter', email: 'john.carter@example.com', role: 'Administrator' },
    { id: 2, fullName: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Manager' },
    { id: 3, fullName: 'Amit Verma', email: 'amit.verma@example.com', role: 'Editor' },
    { id: 4, fullName: 'Lisa Wong', email: 'lisa.wong@example.com', role: 'HR Executive' },
    { id: 5, fullName: 'Michael Smith', email: 'm.smith@example.com', role: 'Finance' },
    { id: 6, fullName: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'Viewer' },
    { id: 7, fullName: 'David Green', email: 'david.green@example.com', role: 'Support' },
    { id: 8, fullName: 'Emily Brown', email: 'emily.brown@example.com', role: 'Developer' },
    { id: 9, fullName: 'Rohit Kumar', email: 'rohit.kumar@example.com', role: 'Operations' },
    { id: 10, fullName: 'Anna Lee', email: 'anna.lee@example.com', role: 'Intern' },
  ]

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const pageSize = 5

  // 🔹 Filtered data
  const filteredData = useMemo(() => {
    return usersData.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [usersData, searchTerm])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage]
  )

  // 🔹 Table Columns
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: 'Full Name',
        accessorKey: 'fullName',
        cell: (info) => (
          <span className='fw-semibold text-dark'>
            {info.getValue() as string}
          </span>
        ),
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: (info) => (
          <span className='text-muted'>{info.getValue() as string}</span>
        ),
      },
      {
        header: 'Role',
        accessorKey: 'role',
        cell: (info) => (
          <span className='text-muted'>{info.getValue() as string}</span>
        ),
      },
      {
        header: () => <div className='text-end'>Actions</div>, // ✅ aligned header
        id: 'actions',
        cell: (info) => {
          const user = info.row.original
          return (
            <div className='text-end'>
              <button
                className='btn btn-sm btn-light-primary me-2'
                onClick={() => alert(`Edit user: ${user.fullName}`)}
              >
                <i className='bi bi-pencil-square'></i> Edit
              </button>
              <button
                className='btn btn-sm btn-light-danger'
                onClick={() => alert(`Delete user: ${user.fullName}`)}
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

  // 🔹 Add User (opens modal)
  const handleAddUser = () => {
    setShowModal(true)
  }

  return (
    <div className='container-fluid mt-15' style={{ maxWidth: '95%' }}>
      {/* 🔹 Page Header */}
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
          Users-Management
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
        {/* Header Row with Search + Add Button */}
        <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3'>
          <h4 className='fw-bold text-primary mb-0'>User List</h4>

          <div className='d-flex align-items-center gap-3'>
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
                placeholder='Search user...'
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

            {/* ➕ Add User Button */}
            <button className='btn btn-primary fw-semibold' onClick={handleAddUser}>
              <i className='bi bi-person-plus-fill me-2'></i> Add User
            </button>
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
                        header.column.id === 'actions' ? 'text-end' : ''
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
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
                        className={
                          cell.column.id === 'actions' ? 'text-end' : ''
                        }
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
                  <td colSpan={columns.length} className='text-center py-5 text-muted'>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='d-flex justify-content-between align-items-center mt-4'>
          <span className='text-muted'>
            Page {currentPage} of {totalPages || 1}
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
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Modal inserted directly here */}
      {showModal && (
        <div
          className='modal fade show d-block'
          tabIndex={-1}
          role='dialog'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className='modal-dialog modal-dialog-centered' role='document'>
            <div className='modal-content p-5'>
              <div className='modal-header border-0'>
                <h5 className='modal-title'>Add New User</h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className='modal-body'>
                <UserEditModalForm user={{} as any} isUserLoading={false} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 🔹 Routes Wrapper
const UsersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='users'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Users Management</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/user-management/users' />} />
    </Routes>
  )
}

export default UsersPage
