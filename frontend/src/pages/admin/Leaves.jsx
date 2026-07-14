import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, X, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchLeaveRequests, changeLeaveStatus } from '../../store/leaveSlice';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const Leaves = () => {
  const dispatch = useDispatch();
  const { requests: leaveRequests, loading } = useSelector((state) => state.leave);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // 'Approved' | 'Rejected'
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

  const handleActionClick = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    const action = await dispatch(
      changeLeaveStatus({ id: selectedRequest._id, status: actionType })
    );

    if (changeLeaveStatus.fulfilled.match(action)) {
      toast.success(`Leave request ${actionType.toLowerCase()} successfully.`);
      setConfirmOpen(false);
    } else {
      toast.error(action.payload || 'Failed to process request.');
    }
  };

  const columns = [
    { key: 'user.name', label: 'Employee', sortable: true },
    { key: 'user.email', label: 'Email' },
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
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        if (row.status !== 'Pending') return <span className="text-xs text-gray-500 font-medium">Processed</span>;
        
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleActionClick(row, 'Approved')}
              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all border border-emerald-500/20"
              title="Approve Request"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleActionClick(row, 'Rejected')}
              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all border border-rose-500/20"
              title="Reject Request"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Leave Management</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Audit and process shop employees leave applications.</p>
      </div>

      {/* Requests Table */}
      <DataTable
        columns={columns}
        data={leaveRequests}
        searchKey="user.name"
        searchPlaceholder="Search by employee name..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'Pending', label: 'Pending Only' },
              { value: 'Approved', label: 'Approved Only' },
              { value: 'Rejected', label: 'Rejected Only' }
            ]
          }
        ]}
        isLoading={loading}
      />

      {/* Confirmation modal */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={`${actionType === 'Approved' ? 'Approve' : 'Reject'} Leave Request`}
        message={`Are you sure you want to change the status of ${selectedRequest?.user?.name || 'this'} leave request to ${actionType}?`}
        confirmText={actionType}
        variant={actionType === 'Rejected' ? 'danger' : 'primary'}
        isLoading={loading}
      />
    </div>
  );
};

export default Leaves;
