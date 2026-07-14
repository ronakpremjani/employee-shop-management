import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, ShieldAlert, BadgeInfo } from 'lucide-react';
import toast from 'react-hot-toast';

import { fetchStaffList, addStaffMember, editStaffMember, deactivateStaffMember } from '../../store/staffSlice';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Dialog from '../../components/common/Dialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';

// Zod schemas for validation
const createSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits'),
  salary: z.coerce.number().min(0, 'Salary must be a positive number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const editSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits'),
  salary: z.coerce.number().min(0, 'Salary must be a positive number'),
  password: z.string().optional().or(z.literal('')),
});

const StaffCRUD = () => {
  const dispatch = useDispatch();
  const { list: staffList, loading, error } = useSelector((state) => state.staff);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Load staff list
  useEffect(() => {
    dispatch(fetchStaffList());
  }, [dispatch]);

  // Form setups
  const addForm = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: { name: '', email: '', phone: '', salary: 0, password: '' }
  });

  const editForm = useForm({
    resolver: zodResolver(editSchema),
  });

  // Actions
  const handleAddSubmit = async (data) => {
    const action = await dispatch(addStaffMember(data));
    if (addStaffMember.fulfilled.match(action)) {
      toast.success('Staff member registered successfully!');
      setIsAddOpen(false);
      addForm.reset();
    } else {
      toast.error(action.payload || 'Failed to create staff.');
    }
  };

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    editForm.reset({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      salary: staff.salary,
      password: ''
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (data) => {
    // If password is empty, remove it from payload so it doesn't overwrite
    const payload = { ...data };
    if (!payload.password) delete payload.password;

    const action = await dispatch(editStaffMember({ id: selectedStaff._id, staffData: payload }));
    if (editStaffMember.fulfilled.match(action)) {
      toast.success('Staff details updated successfully.');
      setIsEditOpen(false);
    } else {
      toast.error(action.payload || 'Failed to update details.');
    }
  };

  const handleDeactivateClick = (staff) => {
    setSelectedStaff(staff);
    setIsDeactivateOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    const action = await dispatch(deactivateStaffMember(selectedStaff._id));
    if (deactivateStaffMember.fulfilled.match(action)) {
      toast.success(`${selectedStaff.name} has been deactivated successfully.`);
      setIsDeactivateOpen(false);
    } else {
      toast.error(action.payload || 'Failed to deactivate employee.');
    }
  };

  // DataTable column definitions
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    {
      key: 'salary',
      label: 'Monthly Salary',
      sortable: true,
      render: (row) => `₹${Number(row.salary).toLocaleString('en-IN')}`
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge status={row.status === 'Active' ? 'active' : 'inactive'}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditClick(row)}
            className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-all"
            title="Edit Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {row.status === 'Active' && (
            <button
              onClick={() => handleDeactivateClick(row)}
              className="p-2 hover:bg-rose-500/5 text-gray-400 hover:text-rose-400 rounded-lg transition-all"
              title="Deactivate Staff"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Staff Directory</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Manage, add, and monitor shop staff profiles.</p>
        </div>
        
        <button
          onClick={() => {
            addForm.reset();
            setIsAddOpen(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Register Staff
        </button>
      </div>

      {/* Reusable table listing staff */}
      <DataTable
        columns={columns}
        data={staffList}
        searchKey="name"
        searchPlaceholder="Search staff by name..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'Active', label: 'Active Only' },
              { value: 'Inactive', label: 'Inactive Only' }
            ]
          }
        ]}
        isLoading={loading}
      />

      {/* Add Staff Dialog */}
      <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Staff Member">
        <form onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-4">
          <FormInput
            label="Full Name"
            name="name"
            placeholder="John Doe"
            error={addForm.formState.errors.name}
            required
            {...addForm.register('name')}
          />
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@shop.com"
            error={addForm.formState.errors.email}
            required
            {...addForm.register('email')}
          />
          <FormInput
            label="Phone Number"
            name="phone"
            placeholder="9876543210"
            error={addForm.formState.errors.phone}
            required
            {...addForm.register('phone')}
          />
          <FormInput
            label="Monthly Salary (₹)"
            name="salary"
            type="number"
            placeholder="30000"
            error={addForm.formState.errors.salary}
            required
            {...addForm.register('salary')}
          />
          <FormInput
            label="Login Password"
            name="password"
            type="password"
            placeholder="Min 8 characters"
            error={addForm.formState.errors.password}
            required
            {...addForm.register('password')}
          />

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg"
            >
              Submit Registration
            </button>
          </div>
        </form>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Staff Details">
        <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
          <FormInput
            label="Full Name"
            name="name"
            placeholder="John Doe"
            error={editForm.formState.errors.name}
            required
            {...editForm.register('name')}
          />
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@shop.com"
            error={editForm.formState.errors.email}
            required
            {...editForm.register('email')}
          />
          <FormInput
            label="Phone Number"
            name="phone"
            placeholder="9876543210"
            error={editForm.formState.errors.phone}
            required
            {...editForm.register('phone')}
          />
          <FormInput
            label="Monthly Salary (₹)"
            name="salary"
            type="number"
            placeholder="30000"
            error={editForm.formState.errors.salary}
            required
            {...editForm.register('salary')}
          />
          <FormInput
            label="Update Password (Optional)"
            name="password"
            type="password"
            placeholder="Leave blank to keep current password"
            error={editForm.formState.errors.password}
            {...editForm.register('password')}
          />

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Staff Member"
        message={`Are you sure you want to deactivate ${selectedStaff?.name}? Once deactivated, they will not be able to log in, and salary ledger generation will be skipped.`}
        confirmText="Deactivate"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
};

export default StaffCRUD;
