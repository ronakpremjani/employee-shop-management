const User = require('../models/User');
const Attendance = require('../models/attendance');
const Salary = require('../models/employeeTransaction/Salary');
const LeaveManagement = require('../models/LeaveManagement');
const AdvanceSalary = require('../models/employeeTransaction/AdvanceSalary');

const getDateKey = (date) => {
    const value = new Date(date);

    return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
};

const generateSalary = async (req, res) => {
    try {
        const { user_id, month, year } = req.body;

        if (!user_id || month === undefined || year === undefined) {
            return res.status(400).json({
                success: false,
                message: 'user_id, month and year are required'
            });
        }

        const salaryMonth = Number(month);
        const salaryYear = Number(year);

        if (!Number.isInteger(salaryMonth) || salaryMonth < 1 || salaryMonth > 12) {
            return res.status(400).json({
                success: false,
                message: 'Month must be between 1 and 12'
            });
        }

        if (!Number.isInteger(salaryYear) || salaryYear < 2000) {
            return res.status(400).json({
                success: false,
                message: 'Year must be greater than or equal to 2000'
            });
        }

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role !== 'staff') {
            return res.status(403).json({
                success: false,
                message: 'Only staff salary can be generated'
            });
        }

        if (user.status !== 'Active') {
            return res.status(403).json({
                success: false,
                message: 'Salary can be generated only for active staff'
            });
        }

        const existingSalary = await Salary.findOne({
            user: user_id,
            month: salaryMonth,
            year: salaryYear
        });

        if (existingSalary) {
            return res.status(409).json({
                success: false,
                message: 'Salary already exists for this month and year'
            });
        }

        const startDate = new Date(salaryYear, salaryMonth - 1, 1);
        const endDate = new Date(salaryYear, salaryMonth, 0, 23, 59, 59, 999);
        const workingDays = endDate.getDate();

        const attendanceRecords = await Attendance.find({
            user: user_id,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).select('date');

        const presentDates = new Set(
            attendanceRecords.map((attendance) => getDateKey(attendance.date))
        );

        const presentDays = presentDates.size;
        const absentDays = workingDays - presentDays;
        const leaveRecords = await LeaveManagement.find({
            user: user_id,
            status: 'Approved',
            dateFrom: { $lte: endDate },
            dateTo: { $gte: startDate }
        });

        const finalAbsentDays = absentDays - leaveRecords.length;
        const updatedPresentDays = presentDates.size;
        const updatedAbsentDays = workingDays - presentDates;

        let leaveDays = 0;

        leaveRecords.forEach((leave) => {
            const leaveStart = new Date(Math.max(leave.dateFrom, startDate));
            const leaveEnd = new Date(Math.min(leave.dateTo, endDate));

            for (
                let d = new Date(leaveStart);
                d <= leaveEnd;
                d.setDate(d.getDate() + 1)
            ) {
                const dateKey = getDateKey(d);
                if (!presentDates.has(dateKey)) {
                    leaveDays++;
                }
            }

            const advanceRecords = await AdvanceSalary.find({
                user: user_id,
                status: 'Approved',
                deductionStatus: 'Pending',
                deductedMonth: salaryMonth,
                deductedYear: salaryYear
            });

            if (advanceRecords.length > 0) {
                const advanceDeduction = advanceRecords.reduce(
                    (total, advance) => total + advance.amount,
                    0
                );

                return res.status(200).json({
                    success: true,
                    message: 'Validation successful. Ready to generate salary.',
                    data: {
                        workingDays,
                        presentDays: updatedPresentDays,
                        absentDays: finalAbsentDays,
                        leaveDays,
                        totalAdvanceDeduction: advanceDeduction,
                        netSalary
                    }
                }); 

            }
            });

            const advanceDeduction = advanceRecords.reduce(
            (total, advance) => total + advance.amount,
            0
            );

            const purchaseDeduction = await ItemPurchase.aggregate([
                {
                    $match: {
                        
                            user: user._id,
                            paymentMethod: 'Salary',
                            status: 'Pending'
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' }
                    }
                }
            ]);

            const itemPurchaseDeduction = purchaseDeduction.length > 0 ? purchaseDeduction[0].totalAmount : 0;

            return res.status(200).json({
                success: true,
                message: 'Validation successful. Ready to generate salary.',
                data: {
                    workingDays,
                    presentDays: updatedPresentDays,
                    absentDays: finalAbsentDays,
                    leaveDays,
                    totalAdvanceDeduction: advanceDeduction,
                    netSalary
                }
            }); 

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    generateSalary
};
