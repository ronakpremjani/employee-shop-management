import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

import { recordPurchase, fetchPurchases } from '../../store/purchaseSlice';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Dialog from '../../components/common/Dialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';

const purchaseRequestSchema = z.object({
  itemName: z.string().trim().min(1, 'Item description is required'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['Salary', 'Cash'], { errorMap: () => ({ message: 'Please select a valid payment mode' }) }),
});

const Purchases = () => {
  const dispatch = useDispatch();
  const { items: myPurchases, loading } = useSelector((state) => state.purchase);
  const [requestOpen, setRequestOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(purchaseRequestSchema),
    defaultValues: { itemName: '', amount: 0, paymentMethod: 'Salary' }
  });

  const onSubmit = async (data) => {
    const action = await dispatch(recordPurchase(data));
    if (recordPurchase.fulfilled.match(action)) {
      toast.success('Purchase logged successfully.');
      setRequestOpen(false);
      reset();
      dispatch(fetchPurchases()); // Refresh history
    } else {
      toast.error(action.payload || 'Failed to log purchase details.');
    }
  };

  const columns = [
    { key: 'itemName', label: 'Item Description', sortable: true },
    {
      key: 'amount',
      label: 'Purchase Cost',
      sortable: true,
      render: (row) => `₹${Number(row.amount).toLocaleString('en-IN')}`
    },
    {
      key: 'paymentMethod',
      label: 'Payment Mode',
      render: (row) => (
        <Badge status={row.paymentMethod === 'Salary' ? 'salary' : 'default'}>
          {row.paymentMethod}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Deduction Status',
      sortable: true,
      render: (row) => (
        <Badge status={row.status === 'Deducted' ? 'deducted' : 'pending'}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Purchase Date',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Tab Purchases</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Record items bought from the shop tab to deduct from salary.</p>
        </div>

        <button
          onClick={() => {
            reset();
            setRequestOpen(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Shop Purchase
        </button>
      </div>

      {/* Purchases history list */}
      <DataTable
        columns={columns}
        data={myPurchases}
        isLoading={loading}
        emptyMessage="You have not logged any item purchases yet."
      />

      {/* Log Purchase Dialog */}
      <Dialog isOpen={requestOpen} onClose={() => setRequestOpen(false)} title="Log New Item Purchase">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Item Description"
            name="itemName"
            placeholder="e.g. Wireless Mouse, RedBull Drink"
            error={errors.itemName}
            required
            {...register('itemName')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Purchase Price (₹)"
              name="amount"
              type="number"
              placeholder="1200"
              error={errors.amount}
              required
              {...register('amount')}
            />

            <FormSelect
              label="Payment Method"
              name="paymentMethod"
              options={[
                { value: 'Salary', label: 'Deduct from Salary Ledger' },
                { value: 'Cash', label: 'Cash Payment' }
              ]}
              error={errors.paymentMethod}
              required
              placeholder="Select method"
              {...register('paymentMethod')}
            />
          </div>

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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg"
            >
              Log Purchase
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Purchases;
