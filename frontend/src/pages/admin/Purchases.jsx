import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import { fetchPurchases } from '../../store/purchaseSlice';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';

const Purchases = () => {
  const dispatch = useDispatch();
  const { items: purchases, loading } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  const columns = [
    { key: 'user.name', label: 'Employee', sortable: true },
    { key: 'user.email', label: 'Email' },
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Shop Item Purchases</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Audit tab item purchases recorded by shop employees.</p>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={purchases}
        searchKey="user.name"
        searchPlaceholder="Search by employee name..."
        filters={[
          {
            key: 'status',
            label: 'Deduction Status',
            options: [
              { value: 'Pending', label: 'Pending Only' },
              { value: 'Deducted', label: 'Deducted Only' }
            ]
          },
          {
            key: 'paymentMethod',
            label: 'Payment Method',
            options: [
              { value: 'Salary', label: 'Deducted from Salary' },
              { value: 'Cash', label: 'Cash Payment' }
            ]
          }
        ]}
        isLoading={loading}
      />
    </div>
  );
};

export default Purchases;
