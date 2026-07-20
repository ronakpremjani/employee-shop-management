import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarCheck, CalendarDays, Search, UserCheck } from 'lucide-react';
import { fetchStaffList } from '../../store/staffSlice';
import { fetchUserAttendance } from '../../store/attendanceSlice';
import DataTable from '../../components/common/DataTable';
import FormSelect from '../../components/forms/FormSelect';

const Attendance = () => {
  const dispatch = useDispatch();
  const { list: staffList } = useSelector((state) => state.staff);
  const { history: attendanceHistory, loading } = useSelector((state) => state.attendance);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Load active staff members on mount
  useEffect(() => {
    dispatch(fetchStaffList());
  }, [dispatch]);

  // Load attendance whenever selected staff changes
  useEffect(() => {
    if (selectedUserId) {
      dispatch(fetchUserAttendance(selectedUserId));
    }
  }, [selectedUserId, dispatch]);

  const activeStaffOptions = staffList
    .filter((s) => s.status === 'Active')
    .map((s) => ({ value: s._id, label: s.name }));

  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (row) => new Date(row.date).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    {
      key: 'checkIn',
      label: 'Check In Time',
      render: (row) => row.checkIn ? new Date(row.checkIn).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) : '-'
    },
    {
      key: 'checkOut',
      label: 'Check Out Time',
      render: (row) => row.checkOut ? new Date(row.checkOut).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) : '-'
    },
    {
      key: 'totalHours',
      label: 'Duration Worked',
      sortable: true,
      render: (row) => row.totalHours ? `${row.totalHours} hrs` : '-'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Staff Attendance</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Review check-in history logs for each staff member.</p>
      </div>

      {/* Select Staff Panel */}
      <div className="glass p-6 rounded-2xl border border-white/5 max-w-md">
        <FormSelect
          label="Select Staff Member"
          name="staffSelector"
          options={activeStaffOptions}
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          placeholder="Choose a staff member from directory..."
        />
      </div>

      {/* Logs Table */}
      {selectedUserId ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <UserCheck className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold">
              Attendance Logs for {staffList.find(s => s._id === selectedUserId)?.name}
            </h3>
          </div>
          <DataTable
            columns={columns}
            data={attendanceHistory}
            isLoading={loading}
            emptyMessage="No attendance records logged for this employee."
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl space-y-3">
          <CalendarDays className="w-12 h-12 text-gray-500 animate-pulse" />
          <h4 className="text-md font-semibold text-gray-300">Select an employee</h4>
          <p className="text-xs text-gray-500">Please choose a staff member above to review check-in/out records.</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;

