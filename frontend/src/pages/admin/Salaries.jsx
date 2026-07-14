import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DollarSign, FileSpreadsheet, Plus, HelpCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

import { fetchStaffList } from '../../store/staffSlice';
import { runGenerateSalary, fetchSalaries } from '../../store/salarySlice';
import DataTable from '../../components/common/DataTable';
import Dialog from '../../components/common/Dialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Badge from '../../components/common/Badge';
import FormSelect from '../../components/forms/FormSelect';
import FormInput from '../../components/forms/FormInput';

const generateSalarySchema = z.object({
  user_id: z.string().min(1, 'Please select a staff member'),
  month: z.coerce.number().min(1, 'Month must be between 1 and 12').max(12),
  year: z.coerce.number().min(2000, 'Year must be greater than or equal to 2000'),
});

const Salaries = () => {
  const dispatch = useDispatch();
  const { list: staffList } = useSelector((state) => state.staff);
  const { history: salaryLedger, loading } = useSelector((state) => state.salary);
  
  // Modals state
  const [generateOpen, setGenerateOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const [selectedSalary, setSelectedSalary] = useState(null);

  useEffect(() => {
    dispatch(fetchStaffList());
    dispatch(fetchSalaries());
  }, [dispatch]);

  const activeStaff = staffList.filter((s) => s.status === 'Active');
  const staffOptions = activeStaff.map((s) => ({ value: s._id, label: s.name }));

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(generateSalarySchema),
    defaultValues: {
      user_id: '',
      month: currentMonth,
      year: currentYear,
    },
  });

  const onSubmit = async (data) => {
    const action = await dispatch(runGenerateSalary(data));
    if (runGenerateSalary.fulfilled.match(action)) {
      toast.success('Salary payslip generated successfully!');
      setGenerateOpen(false);
      reset();
      dispatch(fetchSalaries()); // Refresh history
    } else {
      toast.error(action.payload || 'Failed to generate salary. Ensure user exists and has not been calculated.');
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const columns = [
    { key: 'user.name', label: 'Employee', sortable: true },
    {
      key: 'period',
      label: 'Pay Period',
      render: (row) => `${monthNames[row.month - 1]} ${row.year}`
    },
    {
      key: 'netSalary',
      label: 'Net Pay',
      sortable: true,
      render: (row) => (
        <span className="font-bold text-emerald-400">
          ₹{Number(row.netSalary).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      sortable: true,
      render: (row) => (
        <Badge status={row.paymentStatus === 'Paid' ? 'approved' : 'pending'}>
          {row.paymentStatus || 'Pending'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Date Generated',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
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
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Salary Ledger</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Generate and inspect shop employee monthly payslips.</p>
        </div>

        <button
          onClick={() => {
            reset({ user_id: '', month: currentMonth, year: currentYear });
            setGenerateOpen(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Salary
        </button>
      </div>

      {/* Ledger Table */}
      <DataTable
        columns={columns}
        data={salaryLedger}
        searchKey="user.name"
        searchPlaceholder="Search by employee name..."
        filters={[
          {
            key: 'paymentStatus',
            label: 'Payment Status',
            options: [
              { value: 'Pending', label: 'Pending Payout' },
              { value: 'Paid', label: 'Paid Out' }
            ]
          }
        ]}
        isLoading={loading}
        emptyMessage="No salary slips generated yet."
      />

      {/* Salary Generation Dialog */}
      <Dialog isOpen={generateOpen} onClose={() => setGenerateOpen(false)} title="Generate Monthly Salary Slip">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormSelect
            label="Staff Member"
            name="user_id"
            options={staffOptions}
            error={errors.user_id}
            required
            placeholder="Select staff member to calculate..."
            {...register('user_id')}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Select Month"
              name="month"
              options={[
                { value: '1', label: 'January' },
                { value: '2', label: 'February' },
                { value: '3', label: 'March' },
                { value: '4', label: 'April' },
                { value: '5', label: 'May' },
                { value: '6', label: 'June' },
                { value: '7', label: 'July' },
                { value: '8', label: 'August' },
                { value: '9', label: 'September' },
                { value: '10', label: 'October' },
                { value: '11', label: 'November' },
                { value: '12', label: 'December' },
              ]}
              error={errors.month}
              required
              placeholder="Month"
              {...register('month')}
            />
            
            <FormInput
              label="Select Year"
              name="year"
              type="number"
              error={errors.year}
              required
              {...register('year')}
            />
          </div>

          <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-xl flex items-start space-x-3 text-xs leading-relaxed text-gray-300">
            <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-0.5">Automated Ledger Calculation</p>
              Generating this payslip will pull the attendance logs, deduct pending advance salaries and tab items purchases automatically, then calculate the net payouts.
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setGenerateOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm rounded-xl transition-all shadow-lg"
            >
              Calculate Salary
            </button>
          </div>
        </form>
      </Dialog>

      {/* View Salary Details Dialog */}
      <Dialog isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} title="Payslip Invoice Summary" size="md">
        {selectedSalary && (
          <div className="space-y-6">
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
