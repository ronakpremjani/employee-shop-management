import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, HandCoins } from 'lucide-react';
import toast from 'react-hot-toast';

import { applyForAdvance, fetchAdvanceRequests } from '../../store/advanceSlice';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Dialog from '../../components/common/Dialog';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';

const advanceRequestSchema = z.object({
  amount: z.coerce.number().min(500, 'Minimum advance requested must be ₹500').max(20000, 'Maximum advance allowed is ₹20,000'),
  reason: z.string().trim().min(5, 'Reason must be at least 5 characters'),
});

const Advances = () => {
  const dispatch = useDispatch();
  const { requests: myAdvances, loading } = useSelector((state) => state.advance);
  const [requestOpen, setRequestOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdvanceRequests());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(advanceRequestSchema),
    defaultValues: { amount: 1000, reason: '' }
  });

  const onSubmit = async (data) => {
    const action = await dispatch(applyForAdvance(data));
    if (applyForAdvance.fulfilled.match(action)) {
      toast.success('Advance salary request submitted successfully.');
      setRequestOpen(false);
      reset();
      dispatch(fetchAdvanceRequests()); // Refresh list
    } else {
      toast.error(action.payload || 'Failed to submit advance request.');
    }
  };

  const columns = [
    {
      key: 'amount',
      label: 'Amount Requested',
      sortable: true,
      render: (row) => `₹${Number(row.amount).toLocaleString('en-IN')}`
    },
    { key: 'reason', label: 'Deduction Reason' },
    {
      key: 'createdAt',
      label: 'Request Date',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN')
    },
    {
      key: 'status',
      label: 'Approval Status',
      sortable: true,
      render: (row) => (
        <Badge status={row.status}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'deductionStatus',
      label: 'Ledger Deduction',
      render: (row) => (
        <Badge status={row.deductionStatus === 'Deducted' ? 'deducted' : 'pending'}>
          {row.deductionStatus || 'Pending'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Advance Salaries</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Request an advance payout of your next cycle salary.</p>
        </div>

        <button
          onClick={() => {
            reset();
            setRequestOpen(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-orange-600 hover:bg-orange-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg shadow-orange-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Request Advance
        </button>
      </div>

      {/* Requests list table */}
      <DataTable
        columns={columns}
        data={myAdvances}
        isLoading={loading}
        emptyMessage="You have no advance salary logs requested yet."
      />

      {/* Request Advance Dialog */}
      <Dialog isOpen={requestOpen} onClose={() => setRequestOpen(false)} title="Submit Advance Payout Request">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Requested Loan Amount (₹)"
            name="amount"
            type="number"
            placeholder="5000"
            error={errors.amount}
            required
            {...register('amount')}
          />

          <FormTextarea
            label="Reason for Request"
            name="reason"
            placeholder="Please details the reason for advance (e.g. house rent, emergency invoice)"
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
              Confirm Request
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Advances;

