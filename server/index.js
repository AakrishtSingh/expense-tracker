const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const transactionRoutes = require("./routes/transactionRoutes");


const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/auth");
// Routes
app.use("/api/auth", authRoutes);
app.use('/api/expenses', require('./routes/expense'));
app.use("/api/transactions", transactionRoutes);

// Mongo Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.get('/', (req, res) => res.send('Server Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
