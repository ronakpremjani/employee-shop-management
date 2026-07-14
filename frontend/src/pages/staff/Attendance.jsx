import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, LogOut, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchMyAttendance, recordCheckIn, recordCheckOut } from '../../store/attendanceSlice';
import DataTable from '../../components/common/DataTable';
import Spinner from '../../components/common/Spinner';

const Attendance = () => {
  const dispatch = useDispatch();
  const { history: attendanceHistory, today: todayAttendance, loading } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchMyAttendance());
  }, [dispatch]);

  const handleCheckIn = async () => {
    const action = await dispatch(recordCheckIn());
    if (recordCheckIn.fulfilled.match(action)) {
      toast.success('Checked in successfully. Have a great shift!');
    } else {
      toast.error(action.payload || 'Failed to check in.');
    }
  };

  const handleCheckOut = async () => {
    const action = await dispatch(recordCheckOut());
    if (recordCheckOut.fulfilled.match(action)) {
      toast.success('Checked out successfully. Have a good evening!');
    } else {
      toast.error(action.payload || 'Failed to check out.');
    }
  };

  // Determine current status
  const isCheckedIn = !!todayAttendance;
  const isCheckedOut = todayAttendance && !!todayAttendance.checkOut;

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
        minute: '2-digit'
      }) : '-'
    },
    {
      key: 'checkOut',
      label: 'Check Out Time',
      render: (row) => row.checkOut ? new Date(row.checkOut).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      }) : '-'
    },
    {
      key: 'totalHours',
      label: 'Total Hours Worked',
      sortable: true,
      render: (row) => row.totalHours ? `${row.totalHours} hrs` : '-'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Daily Attendance</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Record check-in/out stamps and review logs.</p>
      </div>

      {/* Control Card */}
      <div className="glass p-6 sm:p-8 rounded-2xl border border-white/5 shadow-2xl max-w-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Attendance console</span>
            
            {isCheckedOut ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-emerald-400 font-bold text-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Shift Completed</span>
                </div>
                <p className="text-sm text-gray-400">
                  You successfully checked out today at{' '}
                  <span className="text-white font-semibold">
                    {new Date(todayAttendance.checkOut).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>.
                </p>
              </div>
            ) : isCheckedIn ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-blue-400 font-bold text-lg">
                  <Clock className="w-5 h-5 animate-pulse" />
                  <span>On Duty (Checked In)</span>
                </div>
                <p className="text-sm text-gray-400">
                  Checked in today at{' '}
                  <span className="text-white font-semibold">
                    {new Date(todayAttendance.checkIn).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-amber-400 font-bold text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Offline (Not Checked In)</span>
                </div>
                <p className="text-sm text-gray-400">Please check in to start tracking your daily shift hours.</p>
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto shrink-0">
            {isCheckedOut ? (
              <button
                disabled
                className="w-full sm:w-auto px-8 py-3 bg-white/5 text-gray-400 font-bold rounded-xl border border-white/5 cursor-not-allowed text-sm"
              >
                All set for today!
              </button>
            ) : isCheckedIn ? (
              <button
                onClick={handleCheckOut}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-rose-600 hover:bg-rose-500 font-bold text-white text-sm rounded-xl transition-all shadow-lg shadow-rose-900/20"
              >
                {loading ? <Spinner size="sm" className="mr-2" /> : <LogOut className="w-4 h-4 mr-2" />}
                Check Out
              </button>
            ) : (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-500 font-bold text-white text-sm rounded-xl transition-all shadow-lg shadow-blue-900/20"
              >
                {loading ? <Spinner size="sm" className="mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                Check In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History logs table */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-white tracking-wide">My Attendance Log History</h3>
        <DataTable
          columns={columns}
          data={attendanceHistory}
          isLoading={loading}
          emptyMessage="No attendance logs recorded yet."
        />
      </div>
    </div>
  );
};

export default Attendance;
