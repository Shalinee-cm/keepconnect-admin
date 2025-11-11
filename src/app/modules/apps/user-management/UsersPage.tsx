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
  { title: '', path: '', isSeparator: true, isActive: false },
]

// 🔹 Users List Wrapper
const UsersListWrapper: React.FC = () => {
  const usersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', position: 'Acme Corp', phone: '9876543210' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', position: 'TechSoft', phone: '7896541230' },
    { id: 3, name: 'Amit Verma', email: 'amit@example.com', position: 'Verma Traders', phone: '9988776655' },
  ]

  const [data, setData] = useState(usersData)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const pageSize = 5

  const filteredData = useMemo(
    () =>
      data.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [data, searchTerm]
  )

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage]
  )

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { header: 'Full Name', accessorKey: 'name' },
      { header: 'Business Name', accessorKey: 'position' },
      { header: 'Phone Number', accessorKey: 'phone' },
      { header: 'Email', accessorKey: 'email' },
      {
        header: 'Actions',
        id: 'actions',
        cell: (info) => {
          const user = info.row.original
          return (
            <div className='d-flex justify-content-end gap-2'>
              <button
                className='btn btn-sm btn-light-primary px-3'
                onClick={() => handleEdit(user)}
              >
                <i className='bi bi-pencil-square'></i> Edit
              </button>
              <button
                className='btn btn-sm btn-light-danger px-3'
                onClick={() => handleDelete(user)}
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

  const handleAddUser = (user: any) => {
    if (selectedUser) {
      setData((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, ...user } : u)))
    } else {
      const newEntry = { id: Date.now(), ...user }
      setData([...data, newEntry])
    }
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = (user: any) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setData((prev) => prev.filter((u) => u.id !== user.id))
    }
  }

  return (
    <div className='container-fluid mt-20' style={{ maxWidth: '95%' }}>
      <div className='d-flex align-items-center justify-content-start mb-10'>
        <h1 className='fw-bold mb-0' style={{ fontSize: '1.2rem', color: '#fff' }}>
          User Management
        </h1>
      </div>

      <div
        className='py-5 '
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          padding: '40px',
        }}
      >
        <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3'>
          <h4 className='fw-bold text-primary mb-0'>Users List</h4>

          <div className='d-flex align-items-center gap-3'>
            <div
              className='d-flex align-items-center px-3 py-1 shadow-sm'
              style={{
                backgroundColor: '#f5f8fa',
                borderRadius: '5px',
                border: '1px solid #e1e3ea',
                width: '180px',
              }}
            >
              <i className='bi bi-search text-muted me-2'></i>
              <input
                type='text'
                className='form-control border-0 bg-transparent'
                placeholder='Search user...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className='btn btn-primary fw-semibold'
              onClick={() => {
                setSelectedUser(null)
                setIsModalOpen(true)
              }}
            >
              <i className='bi bi-plus-lg me-1'></i> Add User
            </button>
          </div>
        </div>

        {/* ✅ Table */}
        <div className='table-responsive ' >
          <table className='table table-hover align-middle'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='text-muted text-uppercase fs-7 border-bottom'>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`${
                        header.column.id === 'actions' ? 'text-end pe-3' : ''
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
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`${
                          cell.column.id === 'actions' ? 'text-end pe-3' : ''
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
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='d-flex justify-content-end align-items-center mt-4 gap-2'>
          <span className='text-muted me-auto'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className='btn btn-sm btn-light'
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

      {/* ✅ Imported Modal */}
      {isModalOpen && (
        <div
          className='modal fade show'
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => e.target === e.currentTarget && handleCancel()}
        >
          <UserEditModalForm
            user={selectedUser || undefined}
            onCancel={handleCancel}
            onSubmit={handleAddUser}
          />
        </div>
      )}
    </div>
  )
}

// 🔹 Routes Wrapper
const UsersPage = () => (
  <Routes>
    <Route element={<Outlet />}>
      <Route
        path='users'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>User Management</PageTitle>
            <UsersListWrapper />
          </>
        }
      />
    </Route>
    <Route index element={<Navigate to='/apps/user-management/users' />} />
  </Routes>
)

export default UsersPage
