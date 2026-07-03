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

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/staff', adminRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.send('API Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

