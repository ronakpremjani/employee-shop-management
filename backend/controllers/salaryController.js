const User = require('../models/User');
const Attendance = require('../models/attendance');
const Salary = require('../models/employeeTransaction/Salary');
const LeaveManagement = require('../models/LeaveManagement');
const AdvanceSalary = require('../models/employeeTransaction/AdvanceSalary');
const ItemPurchase = require('../models/employeeTransaction/ItemPurchase');

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
        }); 
        
        const finalAbsentDays = Math.max(
                0,
                workingDays - presentDays - leaveDays
            );

        const advanceRecords = await AdvanceSalary.find({
                user: user_id,
                status: "Approved",
                deductionStatus: "Pending"
            });

        const advanceDeduction = advanceRecords.reduce(
            (total, advance) => total + advance.amount,
            0
        );

            const purchaseSummary = await ItemPurchase.aggregate([
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

            const itemPurchaseDeduction = purchaseSummary.length > 0 ? purchaseSummary[0].totalAmount : 0;

            const basicSalary = user.salary;
            const perDaySalary = workingDays > 0 ? basicSalary / workingDays : 0;
            const earnedSalary = perDaySalary * presentDays;
            const netSalary = Math.max(
                        0,
                        earnedSalary -
                        advanceDeduction -
                        itemPurchaseDeduction
                    );

            // -------------------------
            // Create Salary
            // -------------------------

            const salary = await Salary.create({
                user: user._id,
                month: salaryMonth,
                year: salaryYear,

                basicSalary,
                perDaySalary,
                earnedSalary,
                
                workingDays,
                presentDays,
                leaveDays,
                absentDays: finalAbsentDays,

                advanceDeduction,
                purchaseDeduction: itemPurchaseDeduction,

                bonus: 0, // We'll implement later

                netSalary,

                generatedBy: req.user._id
            });

           // -------------------------
// Update Advance Salary
// -------------------------

await AdvanceSalary.updateMany(
    {
        user: user_id,
        status: 'Approved',
        deductionStatus: 'Pending'
    },
    {
        $set: {
            deductionStatus: 'Deducted',
            deductedMonth: salaryMonth,
            deductedYear: salaryYear
        }
    }
);

// -------------------------
// Update Item Purchases
// -------------------------

await ItemPurchase.updateMany(
    {
        user: user_id,
        paymentMethod: 'Salary',
        status: 'Pending'
    },
    {
        $set: {
            status: 'Deducted',
            deductedMonth: salaryMonth,
            deductedYear: salaryYear
        }
    }
);

// -------------------------
// Return Response
// -------------------------

return res.status(201).json({
    success: true,
    message: 'Salary generated successfully.',
    data: salary
});

    }catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,            
        });
    }
};

const getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find()
            .populate('user', 'name email phone role')
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: salaries
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMySalaries = async (req, res) => {
    try {
        const salaries = await Salary.find({ user: req.user_id })
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: salaries
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    generateSalary,
    getAllSalaries,
    getMySalaries
};
