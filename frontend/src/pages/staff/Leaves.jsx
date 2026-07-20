import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

import { applyForLeave, fetchLeaveRequests } from '../../store/leaveSlice';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Dialog from '../../components/common/Dialog';
import DatePicker from '../../components/forms/DatePicker';
import FormTextarea from '../../components/forms/FormTextarea';

// Schema validator using Zod
const leaveRequestSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().trim().min(5, 'Reason must be at least 5 characters'),
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: 'End date must be on or after start date',
  path: ['endDate']
});

const Leaves = () => {
  const dispatch = useDispatch();
  const { requests: myLeaves, loading } = useSelector((state) => state.leave);
  const [requestOpen, setRequestOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: { startDate: '', endDate: '', reason: '' }
  });

  const onSubmit = async (data) => {
    // Check if start date is in past
    const today = new Date();
    today.setHours(0,0,0,0);
    const start = new Date(data.startDate);
    
    if (start < today) {
      toast.error('Leave cannot be applied for past dates.');
      return;
    }

    const action = await dispatch(applyForLeave(data));
    if (applyForLeave.fulfilled.match(action)) {
      toast.success('Leave request submitted for review!');
      setRequestOpen(false);
      reset();
      dispatch(fetchLeaveRequests()); // Refresh history
    } else {
      toast.error(action.payload || 'Failed to submit leave request.');
    }
  };

  const columns = [
    {
      key: 'dateFrom',
      label: 'Start Date',
      sortable: true,
      render: (row) => new Date(row.dateFrom || row.startDate).toLocaleDateString('en-IN')
    },
    {
      key: 'dateTo',
      label: 'End Date',
      sortable: true,
      render: (row) => new Date(row.dateTo || row.endDate).toLocaleDateString('en-IN')
    },
    { key: 'reason', label: 'Reason' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge status={row.status}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Date Submitted',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Time Off / Leaves</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Submit new leave requests and check status history.</p>
        </div>

        <button
          onClick={() => {
            reset();
            setRequestOpen(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-orange-600 hover:bg-orange-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg shadow-orange-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Apply for Leave
        </button>
      </div>

      {/* Requests History table */}
      <DataTable
        columns={columns}
        data={myLeaves}
        isLoading={loading}
        emptyMessage="You have not requested any leaves yet."
      />

      {/* Apply Leave Dialog */}
      <Dialog isOpen={requestOpen} onClose={() => setRequestOpen(false)} title="Submit Leave Application">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Leave From"
              name="startDate"
              error={errors.startDate}
              required
              {...register('startDate')}
            />
            <DatePicker
              label="Leave To"
              name="endDate"
              error={errors.endDate}
              required
              {...register('endDate')}
            />
          </div>

          <FormTextarea
            label="Reason for Leave"
            name="reason"
            placeholder="Please detail your reason for taking leave (e.g. sick leave, urgent personal task)"
            error={errors.reason}
            required
            {...register('reason')}
          />

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setRequestOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Leaves;

