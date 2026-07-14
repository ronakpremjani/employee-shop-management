# 🏢 Employee Shop & Payroll Management System

A production-inspired **MERN Stack** application designed to streamline employee management, attendance tracking, leave management, payroll processing, advance salary requests, and employee shop purchases through secure role-based authentication.

> ⚠️ **Note:** This project is currently under active development. Additional features and improvements are being added regularly.

---

# ✨ Features

## 🔐 Authentication & Authorization

- JWT Authentication
- Role-Based Access Control (Admin / Staff)
- Secure Password Hashing with bcrypt
- Protected Routes
- Login & Registration
- Get Current Logged-in User

---

## 👥 Staff Management

- Create Staff
- Update Staff Information
- Activate / Deactivate Staff
- View All Staff
- Staff Profile Management

---

## 📅 Attendance Management

- Mark Daily Attendance
- Prevent Duplicate Attendance
- Attendance History
- Monthly Attendance Tracking

---

## 📝 Leave Management

- Apply Leave
- Approve Leave
- Reject Leave
- Leave History
- Automatic Leave Calculation During Salary Generation

---

## 💰 Advance Salary Management

- Request Advance Salary
- Admin Approval / Rejection
- Advance Salary History
- Automatic Salary Deduction
- Deduction Status Tracking

---

## 🛒 Employee Shop Management

- Purchase Items
- Salary Deduction Payment Option
- Purchase History
- Automatic Salary Deduction
- Purchase Deduction Tracking

---

## 💵 Payroll Management

- Generate Monthly Salary
- Attendance-Based Salary Calculation
- Leave Deduction
- Advance Salary Deduction
- Item Purchase Deduction
- Duplicate Salary Prevention
- Salary History
- Payment Status Tracking
- Carry Forward Salary Support

---

# 🧮 Salary Calculation Formula

```text
Per Day Salary = Basic Salary / Working Days

Earned Salary = Per Day Salary × Present Days

Net Salary =
Earned Salary
- Advance Salary Deduction
- Item Purchase Deduction
+ Bonus (Future)
```

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- React Router DOM
- Redux Toolkit
- React Redux
- Axios
- Tailwind CSS v4
- shadcn/ui
- React Hook Form
- Zod
- React Hot Toast
- Lucide React Icons
- Oxlint

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

## Database

- MongoDB

---

# 📂 Project Structure

```text
employee-shop-management/

├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/ronakpremjani/employee-shop-management.git

cd employee-shop-management
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d
```

---

# 📌 Backend Modules

## Authentication

- Register User
- Login User
- Get Current User

---

## Staff Management

- Create Staff
- Update Staff
- Activate / Deactivate Staff
- List All Staff

---

## Attendance

- Mark Attendance
- Attendance History

---

## Leave Management

- Apply Leave
- Approve Leave
- Reject Leave

---

## Advance Salary

- Request Advance Salary
- Approve / Reject Request
- Advance Salary History

---

## Employee Shop

- Purchase Items
- Purchase History

---

## Salary

- Generate Salary
- Salary History
- Salary Payment Tracking

---

# 🔒 Security

Current Authentication Method

- JWT Authentication
- Bearer Token
- Local Storage *(temporary)*

### Planned Production Upgrade

Before deployment, authentication will be migrated to:

- Secure HttpOnly Cookies
- Refresh Tokens
- Improved XSS Protection

---

# 📈 Future Improvements

- Salary Slip PDF Generation
- Dashboard Analytics
- Email Notifications
- Export Reports (Excel / PDF)
- Audit Logs
- Multi-Branch Support
- Refresh Token Authentication
- Secure HttpOnly Cookies
- Biometric Attendance Integration
- Dark Mode
- Docker Deployment
- CI/CD Pipeline

---

# 📷 Screenshots

> Screenshots will be added after frontend completion.

- Login Page
- Admin Dashboard
- Staff Dashboard
- Staff Management
- Attendance Management
- Leave Management
- Advance Salary
- Employee Shop
- Payroll Management

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📄 License

This project is currently intended as a **Portfolio Project**.

You may add an **MIT License** before making the repository open for contributions.

---

# 👨‍💻 Author

**Ronak Premjani**

📧 Email: ronakpremjani8@gmail.com

🔗 GitHub: https://github.com/ronakpremjani

💼 LinkedIn: https://www.linkedin.com/in/ronak-premjani-10b06a33b/

---

## 🌟 If you found this project helpful, consider giving it a Star ⭐ on GitHub!

Your support helps improve the project and motivates future development.
