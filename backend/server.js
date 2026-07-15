require('dotenv').config();

const dns = require('node:dns');

dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
]);

console.log(dns.getServers());

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();
connectDB();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const advanceSalaryRoutes = require('./routes/advanceSalaryRoutes');
const itemPurchaseRoutes = require('./routes/itemPurchaseRoutes');

app.use(cors({
    origin: [
        "https://employee-shop-management.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/staff', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/advance-salary', advanceSalaryRoutes);
app.use('/api/purchase', itemPurchaseRoutes);

app.get('/', (req, res) => {
  res.send('API Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

