import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { CalendarCheck, CalendarDays, HandCoins, ShoppingBag, DollarSign } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { fetchMyAttendance } from '../../store/attendanceSlice';
import { fetchLeaveRequests } from '../../store/leaveSlice';
import { fetchAdvanceRequests } from '../../store/advanceSlice';
import { fetchSalaries } from '../../store/salarySlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const { today: todayAttendance, loading: attendanceLoading } = useSelector((state) => state.attendance);
  const { requests: leaveRequests, loading: leaveLoading } = useSelector((state) => state.leave);
  const { requests: advanceRequests, loading: advanceLoading } = useSelector((state) => state.advance);
  const { history: salaries, loading: salaryLoading } = useSelector((state) => state.salary);

  useEffect(() => {
    dispatch(fetchMyAttendance());
    dispatch(fetchLeaveRequests());
    dispatch(fetchAdvanceRequests());
    dispatch(fetchSalaries());
  }, [dispatch]);

  // Today's Attendance Status text
  let attendanceStatus = 'Not Checked In';
  if (todayAttendance) {
    attendanceStatus = todayAttendance.checkOut ? 'Checked Out' : 'Active (Checked In)';
  }

  // Count pending leaves and advances
  const myPendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const myPendingAdvances = advanceRequests.filter(a => a.status === 'Pending').length;

  // Personal base salary
  const baseSalary = user?.salary || 0;

  const isGlobalLoading = attendanceLoading || leaveLoading || advanceLoading || salaryLoading;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Staff Console</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">
          Welcome back, {user?.name}. Here is your check-in status and monthly summary.
        </p>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Attendance"
          value={attendanceStatus}
          icon={CalendarCheck}
          isLoading={isGlobalLoading}
        />
        <StatCard
          title="My Base Monthly Salary"
          value={`₹${baseSalary.toLocaleString('en-IN')}`}
          icon={DollarSign}
          isLoading={isGlobalLoading}
        />
        <StatCard
          title="My Pending Leaves"
          value={myPendingLeaves}
          icon={CalendarDays}
          isLoading={isGlobalLoading}
        />
        <StatCard
          title="My Pending Advances"
          value={myPendingAdvances}
          icon={HandCoins}
          isLoading={isGlobalLoading}
        />
      </div>

      {/* Quick Action Links panel */}
      <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-lg font-bold text-white tracking-wide">Quick Action Hub</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NavLink
            to="/staff/attendance"
            className="flex flex-col items-center justify-center p-6 bg-white/[0.01] hover:bg-orange-600/10 border border-white/5 hover:border-orange-500/20 rounded-2xl text-center transition-all group"
          >
            <CalendarCheck className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform mb-3" />
            <span className="text-sm font-bold text-white">Check In / Out</span>
            <span className="text-xs text-gray-400 mt-1">Record daily attendance logs</span>
          </NavLink>

          <NavLink
            to="/staff/leaves"
            className="flex flex-col items-center justify-center p-6 bg-white/[0.01] hover:bg-orange-600/10 border border-white/5 hover:border-orange-500/20 rounded-2xl text-center transition-all group"
          >
            <CalendarDays className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform mb-3" />
            <span className="text-sm font-bold text-white">Apply for Leave</span>
            <span className="text-xs text-gray-400 mt-1">Submit time-off requests</span>
          </NavLink>

          <NavLink
            to="/staff/advances"
            className="flex flex-col items-center justify-center p-6 bg-white/[0.01] hover:bg-orange-600/10 border border-white/5 hover:border-orange-500/20 rounded-2xl text-center transition-all group"
          >
            <HandCoins className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform mb-3" />
            <span className="text-sm font-bold text-white">Request Advance</span>
            <span className="text-xs text-gray-400 mt-1">Borrow from next pay period</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

