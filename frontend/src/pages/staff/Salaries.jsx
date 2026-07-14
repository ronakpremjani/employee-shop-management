import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, FileSpreadsheet, Eye } from 'lucide-react';
import { fetchSalaries } from '../../store/salarySlice';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Dialog from '../../components/common/Dialog';

const Salaries = () => {
  const dispatch = useDispatch();
  const { history: mySalaries, loading } = useSelector((state) => state.salary);
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);

  useEffect(() => {
    dispatch(fetchSalaries());
  }, [dispatch]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const columns = [
    {
      key: 'period',
      label: 'Pay Period',
      sortable: true,
      render: (row) => `${monthNames[row.month - 1]} ${row.year}`
    },
    {
      key: 'workingDays',
      label: 'Days (Work/Present)',
      render: (row) => `${row.presentDays}/${row.workingDays} days`
    },
    {
      key: 'basicSalary',
      label: 'Base Rate',
      render: (row) => `₹${Number(row.basicSalary).toLocaleString('en-IN')}`
    },
    {
      key: 'netSalary',
      label: 'Net Payout',
      sortable: true,
      render: (row) => (
        <span className="font-bold text-emerald-400">
          ₹{Number(row.netSalary).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge status={row.paymentStatus === 'Paid' ? 'approved' : 'pending'}>
          {row.paymentStatus || 'Pending'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Issue Date',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => {
            setSelectedSalary(row);
            setDetailsOpen(true);
          }}
          className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">My Salary Payslips</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Review your generated monthly payslips and itemized deductions.</p>
      </div>

      {/* Salaries Ledger DataTable */}
      <DataTable
        columns={columns}
        data={mySalaries}
        isLoading={loading}
        emptyMessage="No salary slips generated for your profile yet."
      />

      {/* View Salary Details Dialog */}
      <Dialog isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} title="My Payslip Details" size="md">
        {selectedSalary && (
          <div className="space-y-6 animate-fade-in">
            {/* Invoice Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/5">
              <div>
                <h4 className="text-md font-bold text-white tracking-wide">
                  {selectedSalary.user?.name || 'Staff Member'}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">Email: {selectedSalary.user?.email}</p>
              </div>
              <div className="text-right">
                <Badge status={(selectedSalary.paymentStatus || 'Pending') === 'Paid' ? 'approved' : 'pending'}>
                  {selectedSalary.paymentStatus || 'Pending'}
                </Badge>
                <p className="text-[10px] text-gray-400 mt-1">Period: {monthNames[selectedSalary.month - 1]} {selectedSalary.year}</p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-400">
                <span>Working Days in Month</span>
                <span className="font-semibold text-white">{selectedSalary.workingDays} days</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-400">
                <span>Present Days Logged</span>
                <span className="font-semibold text-white">{selectedSalary.presentDays} days</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-400">
                <span>Monthly Base Rate</span>
                <span className="font-semibold text-white">₹{selectedSalary.basicSalary?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-400">
                <span>Earned Salary (Pro-rated)</span>
                <span className="font-semibold text-white">
                  ₹{Math.round(selectedSalary.earnedSalary || (selectedSalary.basicSalary * (selectedSalary.presentDays / selectedSalary.workingDays))).toLocaleString('en-IN')}
                </span>
              </div>
              
              {/* Deductions section */}
              <div className="py-2 mt-4">
                <h5 className="font-semibold text-gray-400 uppercase tracking-wider text-[10px] mb-2">Itemized Deductions</h5>
                <div className="space-y-1.5 bg-white/[0.01] p-3 border border-white/5 rounded-xl">
                  <div className="flex justify-between text-gray-400">
                    <span>Advance Salary Loans</span>
                    <span className="text-rose-400 font-semibold">-₹{selectedSalary.advanceDeduction?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 pt-1.5 border-t border-white/5">
                    <span>Shop Tab Purchases</span>
                    <span className="text-rose-400 font-semibold">-₹{selectedSalary.purchaseDeduction?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Net Payout footer */}
              <div className="flex justify-between py-3 border-t border-b border-white/5 text-sm font-bold mt-4">
                <span className="text-white">Net Payout Amount</span>
                <span className="text-emerald-400">₹{selectedSalary.netSalary?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setDetailsOpen(false)}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-xs rounded-xl border border-white/5 transition-all"
              >
                Close Summary
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Salaries;
