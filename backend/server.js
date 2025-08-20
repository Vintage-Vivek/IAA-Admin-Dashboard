const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://iaa-admin-dashboard.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://<username>:<password>@cluster.mongodb.net/iaa_dashboard?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema
const querySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  query: String,
  datetime: String,
  queryType: String,
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

const Query = mongoose.model('Query', querySchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send confirmation email
function sendConfirmationEmail(toEmail, name) {
  const mailOptionsUser = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Query Submitted - Indian Aviation Academy',
    text: `Dear ${name},\n\nYour query has been submitted successfully. Our team will get back to you as soon as possible.\n\nThank you,\nIndian Aviation Academy`,
  };

  return transporter.sendMail(mailOptionsUser);
}

// ---------------- Routes ---------------- //

// POST /api/queries - Save query + send email
app.post('/api/queries', async (req, res) => {
  const { name, email, phone, query, datetime, queryType } = req.body;

  if (!name || !email || !phone || !query) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const newQuery = new Query({ name, email, phone, query, datetime, queryType });
    await newQuery.save();

    // Send confirmation mail
    if (email && name) {
      await sendConfirmationEmail(email, name);
    }

    res.json({ success: true, message: 'Query received and saved!' });
  } catch (err) {
    console.error('Error saving query:', err);
    res.status(500).json({ success: false, message: 'Failed to save query.' });
  }
});

// GET /api/queries - Get all queries
app.get('/api/queries', async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error('Error fetching queries:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch queries.' });
  }
});

// DELETE /api/queries/:id - Delete a query
app.delete('/api/queries/:id', async (req, res) => {
  try {
    await Query.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting query:', err);
    res.status(500).json({ success: false, message: 'Failed to delete query.' });
  }
});

// POST /api/queries/:id/resolve-and-remove - Mark as resolved + remove
app.post('/api/queries/:id/resolve-and-remove', async (req, res) => {
  try {
    await Query.findByIdAndUpdate(req.params.id, { resolved: true });
    await Query.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error resolving and removing query:', err);
    res.status(500).json({ success: false, message: 'Failed to resolve and remove query.' });
  }
});

// ---------------- Start Server ---------------- //
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
