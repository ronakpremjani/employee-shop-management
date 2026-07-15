require("dotenv").config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const dns = require('node:dns');

dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
]);


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Attendance = require("./models/attendance");
const LeaveManagement = require("./models/leaveManagement");
const AdvanceSalary = require("./models/employeeTransaction/AdvanceSalary");
const ItemPurchase = require("./models/employeeTransaction/ItemPurchase");
const Salary = require("./models/employeeTransaction/Salary");

const connectDB = require("./config/db");

const STAFF_PASSWORD = "Staff@123";

// ----------------------------
// Random Helpers
// ----------------------------

const random = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

const randomBool = (percentage = 50) =>
    Math.random() * 100 < percentage;

// ----------------------------
// Sample Data
// ----------------------------

const firstNames = [
    "Amit",
    "Rahul",
    "Priya",
    "Neha",
    "Karan",
    "Riya",
    "Sneha",
    "Vivek",
    "Pooja",
    "Arjun",
    "Harsh",
    "Nidhi",
    "Manav",
    "Ankit",
    "Rohan",
    "Aakash",
    "Nikita",
    "Yash",
    "Krishna",
    "Jay"
];

const lastNames = [
    "Patel",
    "Shah",
    "Mehta",
    "Desai",
    "Joshi",
    "Trivedi",
    "Panchal",
    "Modi",
    "Sharma",
    "Verma"
];

const leaveReasons = [
    "Medical Leave",
    "Vacation",
    "Family Function",
    "Personal Work",
    "Emergency",
    "Festival Leave"
];

const purchaseItems = [
    "Keyboard",
    "Mouse",
    "Laptop Bag",
    "Office Chair",
    "Headphones",
    "Monitor",
    "Coffee Mug",
    "Water Bottle",
    "Shoes",
    "T-Shirt",
    "Notebook",
    "Backpack"
];

const paymentMethods = [
    "Cash",
    "Online",
    "Salary"
];

// ----------------------------
// Create Staff
// ----------------------------

async function createStaff() {

    console.log("Creating Staff...");

    const hashedPassword = await bcrypt.hash(STAFF_PASSWORD, 10);

    const staff = [];

    for (let i = 1; i <= 15; i++) {

        const first = randomItem(firstNames);
        const last = randomItem(lastNames);

        staff.push({
            name: `${first} ${last}`,
            email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@company.com`,
            phone: `9876543${String(100 + i)}`,
            password: hashedPassword,
            role: "staff",
            salary: random(18000, 50000),
            status: "Active",
            isVerified: true,
            joiningDate: new Date(2025, random(0, 11), random(1, 28))
        });

    }

    const users = await User.insertMany(staff);

    console.log(`✔ ${users.length} Staff Created`);

    return users;

}

// ----------------------------
// Create Attendance
// ----------------------------

async function createAttendance(staffUsers) {

    console.log("Creating Attendance...");

    const attendance = [];

    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth();

    const totalDays = new Date(year, month + 1, 0).getDate();

    for (const user of staffUsers) {

        for (let day = 1; day <= totalDays; day++) {

            const date = new Date(year, month, day);

            // Skip Sundays
            if (date.getDay() === 0) continue;

            // 90% chance of attendance
            if (!randomBool(90)) continue;

            const checkInHour = random(8, 10);
            const checkInMinute = random(0, 59);

            const checkOutHour = random(17, 19);
            const checkOutMinute = random(0, 59);

            const checkIn = new Date(
                year,
                month,
                day,
                checkInHour,
                checkInMinute
            );

            const checkOut = new Date(
                year,
                month,
                day,
                checkOutHour,
                checkOutMinute
            );

            const totalHours =
                Math.round(
                    ((checkOut - checkIn) / (1000 * 60 * 60)) * 100
                ) / 100;

            attendance.push({
                user: user._id,
                date,
                checkIn,
                checkOut,
                totalHours
            });

        }

    }

    await Attendance.insertMany(attendance);

    console.log(`✔ ${attendance.length} Attendance Records Created`);

}

// ----------------------------
// Create Leave Requests
// ----------------------------

async function createLeaveRequests(staffUsers) {

    console.log("Creating Leave Requests...");

    // Use existing admin
    const admin = await User.findOne({ role: "admin" });

    const leaves = [];

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const statuses = [
        "Pending",
        "Approved",
        "Rejected"
    ];

    // Create 2 leave requests per staff
    for (const user of staffUsers) {

        for (let i = 0; i < 2; i++) {

            const startDay = random(2, 24);
            const duration = random(1, 3);

            const dateFrom = new Date(
                year,
                month,
                startDay
            );

            const dateTo = new Date(
                year,
                month,
                startDay + duration
            );

            const status = randomItem(statuses);

            leaves.push({
                user: user._id,

                reason: randomItem(leaveReasons),

                status,

                dateFrom,

                dateTo,

                approvedBy:
                    status === "Approved" ||
                    status === "Rejected"
                        ? admin?._id
                        : null
            });

        }

    }

    await LeaveManagement.insertMany(leaves);

    console.log(`✔ ${leaves.length} Leave Requests Created`);

}

// ----------------------------
// Create Advance Salary Requests
// ----------------------------

async function createAdvanceSalary(staffUsers) {

    console.log("Creating Advance Salary Requests...");

    const admin = await User.findOne({ role: "admin" });

    const advances = [];

    const statuses = [
        "Pending",
        "Approved",
        "Rejected"
    ];

    for (const user of staffUsers) {

        const totalRequests = random(1, 3);

        for (let i = 0; i < totalRequests; i++) {

            const status = randomItem(statuses);

            advances.push({

                user: user._id,

                amount: random(1000, 10000),

                reason: randomItem([
                    "Medical Emergency",
                    "Family Expense",
                    "Personal Work",
                    "Festival",
                    "Education Fees"
                ]),

                requestedDate: new Date(),

                approvedDate:
                    status === "Approved"
                        ? new Date()
                        : null,

                paymentDate:
                    status === "Approved"
                        ? new Date()
                        : null,

                status,

                deductionStatus:
                    status === "Approved"
                        ? "Pending"
                        : "Pending",

                deductedMonth: null,

                deductedYear: null,

                approvedBy:
                    status === "Approved" ||
                    status === "Rejected"
                        ? admin?._id
                        : null,

                createdBy: admin?._id,

                notes: ""
            });

        }

    }

    await AdvanceSalary.insertMany(advances);

    console.log(`✔ ${advances.length} Advance Salary Requests Created`);

}

// ----------------------------
// Create Item Purchases
// ----------------------------

async function createItemPurchases(staffUsers) {

    console.log("Creating Item Purchases...");

    const purchases = [];

    for (const user of staffUsers) {

        const totalPurchases = random(2, 5);

        for (let i = 0; i < totalPurchases; i++) {

            const paymentMethod = randomItem(paymentMethods);

            purchases.push({

                user: user._id,

                productName: randomItem(purchaseItems),

                amount: random(300, 5000),

                purchaseDate: new Date(),

                paymentMethod,

                status:
                    paymentMethod === "Salary"
                        ? "Pending"
                        : "Cancelled",

                deductedMonth: null,

                deductedYear: null,

                createdBy: user._id

            });

        }

    }

    await ItemPurchase.insertMany(purchases);

    console.log(`✔ ${purchases.length} Item Purchases Created`);

}

// ------------------------------------
// Seed Database
// ------------------------------------

async function seedDatabase() {
    try {

        await connectDB();

        console.log("\n===============================");
        console.log("🌱 Starting Database Seeder...");
        console.log("===============================\n");

        // ----------------------------
        // Keep Existing Admin
        // ----------------------------

        await User.deleteMany({
            role: "staff"
        });

        await Attendance.deleteMany();

        await LeaveManagement.deleteMany();

        await AdvanceSalary.deleteMany();

        await ItemPurchase.deleteMany();

        await Salary.deleteMany();

        console.log("✔ Old Test Data Removed\n");

        // ----------------------------
        // Create Staff
        // ----------------------------

        const staffUsers = await createStaff();

        // ----------------------------
        // Attendance
        // ----------------------------

        await createAttendance(staffUsers);

        // ----------------------------
        // Leave
        // ----------------------------

        await createLeaveRequests(staffUsers);

        // ----------------------------
        // Advance Salary
        // ----------------------------

        await createAdvanceSalary(staffUsers);

        // ----------------------------
        // Item Purchases
        // ----------------------------

        await createItemPurchases(staffUsers);

        console.log("\n===============================");
        console.log("🎉 DATABASE SEEDED SUCCESSFULLY");
        console.log("===============================\n");

        console.log("Login Credentials\n");

        console.log("Admin");
        console.log("Email    : Your Existing Admin Email");
        console.log("Password : Your Existing Admin Password\n");

        console.log("Staff");
        console.log("Email    : staff1@company.com");
        console.log("Password : Staff@123\n");

        process.exit(0);

    } catch (error) {

        console.error(error);

        process.exit(1);

    }
}

seedDatabase();