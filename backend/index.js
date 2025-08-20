const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || process.env.ROUTE_OPTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema
const querySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  query: String,
  datetime: String,
  queryType: String,
}, { timestamps: true });

const Query = mongoose.model('Query', querySchema);

// Mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Confirmation email (only to user)
function sendConfirmationEmail(toEmail, name) {
  const mailOptionsUser = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Query Submitted - Indian Aviation Academy',
    text: `Dear ${name},\n\nYour query has been submitted successfully. Our team will get back to you as soon as possible.\n\nThank you,\nIndian Aviation Academy`,
  };

  return transporter.sendMail(mailOptionsUser);
}

// Routes
app.post('/api/queries', async (req, res) => {
  try {
    const newQuery = new Query(req.body);
    await newQuery.save();

    // Send confirmation mail to user
    if (req.body.email && req.body.name) {
      await sendConfirmationEmail(req.body.email, req.body.name);
    }

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/queries', async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/queries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Query.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
