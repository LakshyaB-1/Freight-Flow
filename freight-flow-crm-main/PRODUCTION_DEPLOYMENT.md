# Freight Link Logistics - Production Deployment Guide

## Complete Full-Stack CRM Application

This document contains the complete source code for deploying the Freight Link Logistics CRM as a production web application.

---

## Folder Structure

```
freight-link-logistics/
├── client/                          # React + Vite Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── placeholder.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/                  # Reusable UI components
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── calendar.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── sonner.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── toaster.tsx
│   │   │   │   └── tooltip.tsx
│   │   │   ├── AdminUserManagement.tsx
│   │   │   ├── DocumentUpload.tsx
│   │   │   ├── ExcelImport.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileShipmentCard.tsx
│   │   │   ├── NavLink.tsx
│   │   │   ├── ReportsAnalytics.tsx
│   │   │   ├── ShipmentDetails.tsx
│   │   │   ├── ShipmentForm.tsx
│   │   │   ├── ShipmentTable.tsx
│   │   │   ├── ShipmentTimeline.tsx
│   │   │   └── StatCard.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-toast.ts
│   │   │   ├── useDocuments.tsx
│   │   │   ├── useShipments.tsx
│   │   │   ├── useShipmentTimeline.tsx
│   │   │   └── useUserRole.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── Auth.tsx
│   │   │   ├── Index.tsx
│   │   │   └── NotFound.tsx
│   │   ├── types/
│   │   │   └── shipment.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── server/                          # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── documentController.js
│   │   │   ├── shipmentController.js
│   │   │   ├── timelineController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   ├── Document.js
│   │   │   ├── NotificationPreference.js
│   │   │   ├── Shipment.js
│   │   │   ├── Timeline.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── documents.js
│   │   │   ├── shipments.js
│   │   │   ├── timeline.js
│   │   │   └── users.js
│   │   ├── services/
│   │   │   ├── emailService.js
│   │   │   └── storageService.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   └── app.js
│   ├── uploads/                     # File uploads directory
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── README.md
```

---

## SERVER (Backend)

### server/package.json

```json
{
  "name": "freight-link-server",
  "version": "1.0.0",
  "description": "Freight Link Logistics API Server",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node src/utils/seed.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### server/.env.example

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freight-link?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Email Configuration (optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@freightlink.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### server/.gitignore

```gitignore
node_modules/
.env
uploads/*
!uploads/.gitkeep
*.log
.DS_Store
```

### server/server.js

```javascript
import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/database.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
```

### server/src/app.js

```javascript
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import shipmentRoutes from './routes/shipments.js';
import documentRoutes from './routes/documents.js';
import timelineRoutes from './routes/timeline.js';
import userRoutes from './routes/users.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
```

### server/src/config/database.js

```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
```

### server/src/models/User.js

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  companyName: {
    type: String,
    trim: true,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  notificationPreferences: {
    emailOnStatusChange: { type: Boolean, default: true },
    emailOnDocumentUpload: { type: Boolean, default: true },
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
```

### server/src/models/Shipment.js

```javascript
import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  blDate: {
    type: Date,
    default: null,
  },
  consignee: {
    type: String,
    required: [true, 'Consignee is required'],
    trim: true,
  },
  shipper: {
    type: String,
    required: [true, 'Shipper is required'],
    trim: true,
  },
  commodity: {
    type: String,
    required: [true, 'Commodity is required'],
    trim: true,
  },
  containerNo: {
    type: String,
    trim: true,
    default: null,
  },
  containerSize: {
    type: String,
    enum: ['20', '40', null],
    default: null,
  },
  shippingLine: {
    type: String,
    trim: true,
    default: null,
  },
  type: {
    type: String,
    enum: ['FCL', 'LCL', null],
    default: null,
  },
  forwarder: {
    type: String,
    trim: true,
    default: null,
  },
  cha: {
    type: String,
    trim: true,
    default: null,
  },
  noOfPackets: {
    type: Number,
    min: 0,
    default: null,
  },
  weight: {
    type: Number,
    min: 0,
    default: null,
  },
  cbm: {
    type: Number,
    min: 0,
    default: null,
  },
  status: {
    type: String,
    enum: ['PENDING', 'DONE'],
    default: 'PENDING',
  },
  beNo: {
    type: String,
    trim: true,
    default: null,
  },
  beDate: {
    type: Date,
    default: null,
  },
  currentStatus: {
    type: String,
    trim: true,
    default: null,
  },
  iecNo: {
    type: String,
    trim: true,
    default: null,
  },
  isAirway: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for common queries
shipmentSchema.index({ userId: 1, createdAt: -1 });
shipmentSchema.index({ containerNo: 1 });
shipmentSchema.index({ status: 1 });

const Shipment = mongoose.model('Shipment', shipmentSchema);

export default Shipment;
```

### server/src/models/Document.js

```javascript
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
    trim: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    default: null,
  },
  fileSize: {
    type: Number,
    default: null,
  },
}, {
  timestamps: true,
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
```

### server/src/models/Timeline.js

```javascript
import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventType: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  oldStatus: {
    type: String,
    default: null,
  },
  newStatus: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

const Timeline = mongoose.model('Timeline', timelineSchema);

export default Timeline;
```

### server/src/models/NotificationPreference.js

```javascript
import mongoose from 'mongoose';

const notificationPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  emailOnStatusChange: {
    type: Boolean,
    default: true,
  },
  emailOnDocumentUpload: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const NotificationPreference = mongoose.model('NotificationPreference', notificationPreferenceSchema);

export default NotificationPreference;
```

### server/src/middleware/auth.js

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};
```

### server/src/middleware/errorHandler.js

```javascript
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

### server/src/middleware/validation.js

```javascript
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: errors.array().map(e => e.msg).join(', '),
      errors: errors.array() 
    });
  }
  next();
};

export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

export const validateShipment = [
  body('date')
    .notEmpty()
    .withMessage('Date is required'),
  body('consignee')
    .notEmpty()
    .withMessage('Consignee is required')
    .trim(),
  body('shipper')
    .notEmpty()
    .withMessage('Shipper is required')
    .trim(),
  body('commodity')
    .notEmpty()
    .withMessage('Commodity is required')
    .trim(),
  handleValidationErrors,
];
```

### server/src/controllers/authController.js

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, companyName } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create user
    const user = await User.create({
      email,
      password,
      companyName,
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      id: user._id,
      email: user.email,
      companyName: user.companyName,
      role: user.role,
      notificationPreferences: user.notificationPreferences,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { companyName, notificationPreferences } = req.body;
    
    const updateData = {};
    if (companyName !== undefined) updateData.companyName = companyName;
    if (notificationPreferences) updateData.notificationPreferences = notificationPreferences;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      id: user._id,
      email: user.email,
      companyName: user.companyName,
      role: user.role,
      notificationPreferences: user.notificationPreferences,
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// @route   PUT /api/auth/password
// @desc    Change password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('ChangePassword error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};
```

### server/src/controllers/shipmentController.js

```javascript
import Shipment from '../models/Shipment.js';
import Timeline from '../models/Timeline.js';

// @route   GET /api/shipments
// @desc    Get all shipments for current user
// @access  Private
export const getShipments = async (req, res) => {
  try {
    const { status, search, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    const query = { userId: req.user._id };
    
    // Filter by status
    if (status && status !== 'ALL') {
      query.status = status;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { containerNo: { $regex: search, $options: 'i' } },
        { consignee: { $regex: search, $options: 'i' } },
        { shipper: { $regex: search, $options: 'i' } },
        { commodity: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [shipments, total] = await Promise.all([
      Shipment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Shipment.countDocuments(query),
    ]);
    
    res.json({
      shipments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('GetShipments error:', error);
    res.status(500).json({ message: 'Error fetching shipments' });
  }
};

// @route   GET /api/shipments/:id
// @desc    Get single shipment
// @access  Private
export const getShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    res.json(shipment);
  } catch (error) {
    console.error('GetShipment error:', error);
    res.status(500).json({ message: 'Error fetching shipment' });
  }
};

// @route   POST /api/shipments
// @desc    Create a new shipment
// @access  Private
export const createShipment = async (req, res) => {
  try {
    const shipmentData = {
      ...req.body,
      userId: req.user._id,
    };
    
    const shipment = await Shipment.create(shipmentData);
    
    // Create timeline entry
    await Timeline.create({
      shipmentId: shipment._id,
      userId: req.user._id,
      eventType: 'CREATED',
      description: 'Shipment created',
      newStatus: shipment.status,
    });
    
    res.status(201).json(shipment);
  } catch (error) {
    console.error('CreateShipment error:', error);
    res.status(500).json({ message: 'Error creating shipment' });
  }
};

// @route   PUT /api/shipments/:id
// @desc    Update a shipment
// @access  Private
export const updateShipment = async (req, res) => {
  try {
    const existingShipment = await Shipment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!existingShipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    const oldStatus = existingShipment.status;
    
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // Create timeline entry if status changed
    if (oldStatus !== shipment.status) {
      await Timeline.create({
        shipmentId: shipment._id,
        userId: req.user._id,
        eventType: 'STATUS_CHANGE',
        description: `Status changed from ${oldStatus} to ${shipment.status}`,
        oldStatus,
        newStatus: shipment.status,
      });
    }
    
    res.json(shipment);
  } catch (error) {
    console.error('UpdateShipment error:', error);
    res.status(500).json({ message: 'Error updating shipment' });
  }
};

// @route   DELETE /api/shipments/:id
// @desc    Delete a shipment
// @access  Private
export const deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    // Delete related timelines and documents
    await Timeline.deleteMany({ shipmentId: req.params.id });
    
    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    console.error('DeleteShipment error:', error);
    res.status(500).json({ message: 'Error deleting shipment' });
  }
};

// @route   POST /api/shipments/bulk
// @desc    Import multiple shipments
// @access  Private
export const bulkImport = async (req, res) => {
  try {
    const { shipments } = req.body;
    
    if (!Array.isArray(shipments) || shipments.length === 0) {
      return res.status(400).json({ message: 'No shipments provided' });
    }
    
    const shipmentsWithUser = shipments.map(s => ({
      ...s,
      userId: req.user._id,
    }));
    
    const created = await Shipment.insertMany(shipmentsWithUser, {
      ordered: false,
    });
    
    res.status(201).json({
      message: `${created.length} shipments imported successfully`,
      count: created.length,
    });
  } catch (error) {
    console.error('BulkImport error:', error);
    res.status(500).json({ message: 'Error importing shipments' });
  }
};

// @route   GET /api/shipments/stats
// @desc    Get shipment statistics
// @access  Private
export const getStats = async (req, res) => {
  try {
    const stats = await Shipment.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
          done: { $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] } },
          totalWeight: { $sum: '$weight' },
          totalCbm: { $sum: '$cbm' },
        },
      },
    ]);
    
    const result = stats[0] || {
      total: 0,
      pending: 0,
      done: 0,
      totalWeight: 0,
      totalCbm: 0,
    };
    
    res.json(result);
  } catch (error) {
    console.error('GetStats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};
```

### server/src/controllers/documentController.js

```javascript
import Document from '../models/Document.js';
import Shipment from '../models/Shipment.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @route   GET /api/documents/:shipmentId
// @desc    Get all documents for a shipment
// @access  Private
export const getDocuments = async (req, res) => {
  try {
    // Verify user owns the shipment
    const shipment = await Shipment.findOne({
      _id: req.params.shipmentId,
      userId: req.user._id,
    });
    
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    const documents = await Document.find({ shipmentId: req.params.shipmentId })
      .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    console.error('GetDocuments error:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

// @route   POST /api/documents/:shipmentId
// @desc    Upload a document
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Verify user owns the shipment
    const shipment = await Shipment.findOne({
      _id: req.params.shipmentId,
      userId: req.user._id,
    });
    
    if (!shipment) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    const document = await Document.create({
      shipmentId: req.params.shipmentId,
      userId: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });
    
    res.status(201).json(document);
  } catch (error) {
    console.error('UploadDocument error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading document' });
  }
};

// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
    
    await document.deleteOne();
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('DeleteDocument error:', error);
    res.status(500).json({ message: 'Error deleting document' });
  }
};

// @route   GET /api/documents/download/:id
// @desc    Download a document
// @access  Private
export const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    
    res.download(document.filePath, document.fileName);
  } catch (error) {
    console.error('DownloadDocument error:', error);
    res.status(500).json({ message: 'Error downloading document' });
  }
};
```

### server/src/controllers/timelineController.js

```javascript
import Timeline from '../models/Timeline.js';
import Shipment from '../models/Shipment.js';

// @route   GET /api/timeline/:shipmentId
// @desc    Get timeline for a shipment
// @access  Private
export const getTimeline = async (req, res) => {
  try {
    // Verify user owns the shipment
    const shipment = await Shipment.findOne({
      _id: req.params.shipmentId,
      userId: req.user._id,
    });
    
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    const timeline = await Timeline.find({ shipmentId: req.params.shipmentId })
      .sort({ createdAt: -1 });
    
    res.json(timeline);
  } catch (error) {
    console.error('GetTimeline error:', error);
    res.status(500).json({ message: 'Error fetching timeline' });
  }
};

// @route   POST /api/timeline/:shipmentId
// @desc    Add timeline event
// @access  Private
export const addTimelineEvent = async (req, res) => {
  try {
    const { eventType, description, oldStatus, newStatus } = req.body;
    
    // Verify user owns the shipment
    const shipment = await Shipment.findOne({
      _id: req.params.shipmentId,
      userId: req.user._id,
    });
    
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    const event = await Timeline.create({
      shipmentId: req.params.shipmentId,
      userId: req.user._id,
      eventType,
      description,
      oldStatus,
      newStatus,
    });
    
    res.status(201).json(event);
  } catch (error) {
    console.error('AddTimelineEvent error:', error);
    res.status(500).json({ message: 'Error adding timeline event' });
  }
};
```

### server/src/controllers/userController.js

```javascript
import User from '../models/User.js';

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('GetUsers error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Prevent changing own role
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('UpdateUserRole error:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// @route   PUT /api/users/:id/status
// @desc    Toggle user active status (admin only)
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    // Prevent deactivating own account
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('ToggleUserStatus error:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
};

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    // Prevent deleting own account
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DeleteUser error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};
```

### server/src/routes/auth.js

```javascript
import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

export default router;
```

### server/src/routes/shipments.js

```javascript
import express from 'express';
import {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  deleteShipment,
  bulkImport,
  getStats,
} from '../controllers/shipmentController.js';
import { protect } from '../middleware/auth.js';
import { validateShipment } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

router.get('/', getShipments);
router.get('/stats', getStats);
router.get('/:id', getShipment);
router.post('/', validateShipment, createShipment);
router.post('/bulk', bulkImport);
router.put('/:id', updateShipment);
router.delete('/:id', deleteShipment);

export default router;
```

### server/src/routes/documents.js

```javascript
import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocument,
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

router.use(protect);

router.get('/:shipmentId', getDocuments);
router.post('/:shipmentId', upload.single('file'), uploadDocument);
router.delete('/:id', deleteDocument);
router.get('/download/:id', downloadDocument);

export default router;
```

### server/src/routes/timeline.js

```javascript
import express from 'express';
import { getTimeline, addTimelineEvent } from '../controllers/timelineController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/:shipmentId', getTimeline);
router.post('/:shipmentId', addTimelineEvent);

export default router;
```

### server/src/routes/users.js

```javascript
import express from 'express';
import {
  getUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', toggleUserStatus);
router.delete('/:id', deleteUser);

export default router;
```

### server/src/services/emailService.js

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendStatusChangeEmail = async (to, shipmentData) => {
  const { containerNo, consignee, oldStatus, newStatus } = shipmentData;
  
  const statusColor = newStatus === 'DONE' ? '#22c55e' : '#f59e0b';
  const statusText = newStatus === 'DONE' ? 'COMPLETED' : 'PENDING';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">📦 Shipment Status Update</h1>
        </div>
        <div style="padding: 30px;">
          <p>Your shipment status has been updated:</p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>Container:</strong> ${containerNo}</p>
            <p><strong>Consignee:</strong> ${consignee}</p>
            <p><strong>Previous:</strong> ${oldStatus}</p>
            <p><strong>New Status:</strong> <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px;">${statusText}</span></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Shipment Status Update: ${containerNo}`,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};
```

### server/src/utils/helpers.js

```javascript
export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

export const paginate = (page = 1, limit = 10) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  return { skip, limit: parseInt(limit) };
};
```

### server/src/utils/seed.js

```javascript
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = await User.create({
      email: 'admin@freightlink.com',
      password: 'admin123456',
      companyName: 'Freight Link Logistics',
      role: 'admin',
    });
    
    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Password: admin123456');
    console.log('Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
```

---

## CLIENT (Frontend)

### client/package.json

```json
{
  "name": "freight-link-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-sheet": "^1.0.0",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@tanstack/react-query": "^5.83.0",
    "axios": "^1.6.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.462.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "xlsx": "^0.18.5",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@types/node": "^22.5.5",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.3",
    "typescript-eslint": "^8.0.1",
    "vite": "^5.4.8"
  }
}
```

### client/.env.example

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Freight Link Logistics
```

### client/.gitignore

```gitignore
node_modules/
dist/
.env
*.log
.DS_Store
```

### client/index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Freight Link Logistics - Forwarding Agency Management</title>
    <meta name="description" content="Professional logistics solution for freight forwarding agencies." />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### client/vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### client/tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
```

### client/postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### client/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### client/src/main.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
```

### client/src/App.tsx

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Index from './pages/Index';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
```

### client/src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 199 89% 48%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 199 89% 48%;
    --radius: 0.5rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 199 89% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 199 89% 48%;
    --chart-1: 199 89% 48%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 199 89% 48%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 199 89% 48%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 199 89% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 199 89% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### client/src/lib/api.ts

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; companyName?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { companyName?: string; notificationPreferences?: object }) =>
    api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
};

// Shipments API
export const shipmentsApi = {
  getAll: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/shipments', { params }),
  getOne: (id: string) => api.get(`/shipments/${id}`),
  create: (data: object) => api.post('/shipments', data),
  update: (id: string, data: object) => api.put(`/shipments/${id}`, data),
  delete: (id: string) => api.delete(`/shipments/${id}`),
  bulkImport: (shipments: object[]) => api.post('/shipments/bulk', { shipments }),
  getStats: () => api.get('/shipments/stats'),
};

// Documents API
export const documentsApi = {
  getByShipment: (shipmentId: string) => api.get(`/documents/${shipmentId}`),
  upload: (shipmentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/documents/${shipmentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: string) => api.delete(`/documents/${id}`),
  getDownloadUrl: (id: string) => `${API_URL}/documents/download/${id}`,
};

// Timeline API
export const timelineApi = {
  getByShipment: (shipmentId: string) => api.get(`/timeline/${shipmentId}`),
  add: (shipmentId: string, data: { eventType: string; description: string; oldStatus?: string; newStatus?: string }) =>
    api.post(`/timeline/${shipmentId}`, data),
};

// Users API (Admin)
export const usersApi = {
  getAll: () => api.get('/users'),
  updateRole: (id: string, role: string) => api.put(`/users/${id}/role`, { role }),
  toggleStatus: (id: string) => api.put(`/users/${id}/status`),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export default api;
```

### client/src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### client/src/contexts/AuthContext.tsx

```tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  companyName: string | null;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, companyName?: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authApi.getMe();
          setUser(response.data);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.response?.data?.message || 'Login failed') };
    }
  };

  const signUp = async (email: string, password: string, companyName?: string) => {
    try {
      const response = await authApi.register({ email, password, companyName });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.response?.data?.message || 'Registration failed') };
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### client/src/types/shipment.ts

```typescript
export interface Shipment {
  _id: string;
  id?: string;
  date: string;
  blDate: string | null;
  consignee: string;
  shipper: string;
  commodity: string;
  containerNo: string | null;
  containerSize: '20' | '40' | null;
  shippingLine: string | null;
  type: 'FCL' | 'LCL' | null;
  forwarder: string | null;
  cha: string | null;
  noOfPackets: number | null;
  weight: number | null;
  cbm: number | null;
  status: 'PENDING' | 'DONE';
  beNo: string | null;
  beDate: string | null;
  currentStatus: string | null;
  iecNo: string | null;
  isAirway: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ShipmentFormData = Omit<Shipment, '_id' | 'id' | 'createdAt' | 'updatedAt'>;
```

### client/src/hooks/useShipments.tsx

```typescript
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shipmentsApi } from '@/lib/api';
import { Shipment, ShipmentFormData } from '@/types/shipment';
import { toast } from 'sonner';

export const useShipments = () => {
  const queryClient = useQueryClient();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const response = await shipmentsApi.getAll();
      return response.data.shipments.map((s: any) => ({
        ...s,
        id: s._id,
        blDate: s.blDate || null,
        beDate: s.beDate || null,
      }));
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ShipmentFormData) => shipmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create shipment');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShipmentFormData> }) =>
      shipmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update shipment');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => shipmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setSelectedShipment(null);
      toast.success('Shipment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete shipment');
    },
  });

  const addShipment = useCallback(
    (data: ShipmentFormData) => createMutation.mutate(data),
    [createMutation]
  );

  const updateShipment = useCallback(
    (id: string, data: Partial<ShipmentFormData>) => updateMutation.mutate({ id, data }),
    [updateMutation]
  );

  const deleteShipment = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation]
  );

  const toggleStatus = useCallback(
    (id: string) => {
      const shipment = data?.find((s: Shipment) => s.id === id || s._id === id);
      if (shipment) {
        const newStatus = shipment.status === 'PENDING' ? 'DONE' : 'PENDING';
        updateMutation.mutate({ id, data: { status: newStatus } });
      }
    },
    [data, updateMutation]
  );

  return {
    shipments: data || [],
    loading: isLoading,
    error: error?.message || null,
    selectedShipment,
    setSelectedShipment,
    addShipment,
    updateShipment,
    deleteShipment,
    toggleStatus,
    refetch,
  };
};
```

### client/src/hooks/useUserRole.tsx

```typescript
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'admin' | 'user';

export const useUserRole = () => {
  const { user, loading } = useAuth();

  return {
    role: user?.role || 'user',
    isAdmin: user?.role === 'admin',
    loading,
  };
};
```

### client/src/hooks/useDocuments.tsx

```typescript
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api';
import { toast } from 'sonner';

export interface ShipmentDocument {
  _id: string;
  id?: string;
  shipmentId: string;
  fileName: string;
  filePath: string;
  fileType: string | null;
  fileSize: number | null;
  createdAt: string;
}

export const useDocuments = (shipmentId: string | null) => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['documents', shipmentId],
    queryFn: async () => {
      if (!shipmentId) return [];
      const response = await documentsApi.getByShipment(shipmentId);
      return response.data.map((d: any) => ({ ...d, id: d._id }));
    },
    enabled: !!shipmentId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!shipmentId) throw new Error('No shipment selected');
      setUploading(true);
      return documentsApi.upload(shipmentId, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', shipmentId] });
      toast.success('Document uploaded successfully');
      setUploading(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload document');
      setUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', shipmentId] });
      toast.success('Document deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete document');
    },
  });

  const uploadDocument = useCallback(
    (file: File) => uploadMutation.mutate(file),
    [uploadMutation]
  );

  const deleteDocument = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation]
  );

  const getDownloadUrl = useCallback(
    (id: string) => documentsApi.getDownloadUrl(id),
    []
  );

  return {
    documents: data || [],
    loading: isLoading,
    uploading,
    uploadDocument,
    deleteDocument,
    getDownloadUrl,
  };
};
```

### client/src/hooks/useShipmentTimeline.tsx

```typescript
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timelineApi } from '@/lib/api';

export interface TimelineEvent {
  _id: string;
  id?: string;
  shipmentId: string;
  eventType: string;
  description: string;
  oldStatus: string | null;
  newStatus: string | null;
  createdAt: string;
}

export const useShipmentTimeline = (shipmentId: string | null) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['timeline', shipmentId],
    queryFn: async () => {
      if (!shipmentId) return [];
      const response = await timelineApi.getByShipment(shipmentId);
      return response.data.map((t: any) => ({ ...t, id: t._id }));
    },
    enabled: !!shipmentId,
  });

  const addMutation = useMutation({
    mutationFn: (eventData: {
      eventType: string;
      description: string;
      oldStatus?: string;
      newStatus?: string;
    }) => {
      if (!shipmentId) throw new Error('No shipment selected');
      return timelineApi.add(shipmentId, eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline', shipmentId] });
    },
  });

  const addTimelineEvent = useCallback(
    (eventType: string, description: string, oldStatus?: string, newStatus?: string) => {
      addMutation.mutate({ eventType, description, oldStatus, newStatus });
    },
    [addMutation]
  );

  return {
    events: data || [],
    loading: isLoading,
    addTimelineEvent,
  };
};
```

### client/src/hooks/use-mobile.tsx

```typescript
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
```

### client/src/hooks/use-toast.ts

```typescript
import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(7);
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}

export { type Toast };
```

---

## PAGES

### client/src/pages/Auth.tsx

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ship, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const companyName = formData.get('companyName') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, companyName);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      toast.success('Account created successfully!');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-xl">
              <Ship className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Freight Link Logistics</CardTitle>
          <CardDescription>Forwarding Agency Management System</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    name="companyName"
                    type="text"
                    placeholder="Your Company Ltd."
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
```

### client/src/pages/Index.tsx

```tsx
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useShipments } from '@/hooks/useShipments';
import { useUserRole } from '@/hooks/useUserRole';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import ShipmentTable from '@/components/ShipmentTable';
import ShipmentForm from '@/components/ShipmentForm';
import ShipmentDetails from '@/components/ShipmentDetails';
import ExcelImport from '@/components/ExcelImport';
import ReportsAnalytics from '@/components/ReportsAnalytics';
import AdminUserManagement from '@/components/AdminUserManagement';
import MobileShipmentCard from '@/components/MobileShipmentCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Package,
  Clock,
  CheckCircle2,
  Plus,
  Upload,
  BarChart3,
  Users,
  LogOut,
  Settings,
} from 'lucide-react';
import { Shipment, ShipmentFormData } from '@/types/shipment';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { signOut, user } = useAuth();
  const { isAdmin } = useUserRole();
  const {
    shipments,
    loading,
    selectedShipment,
    setSelectedShipment,
    addShipment,
    updateShipment,
    deleteShipment,
    toggleStatus,
  } = useShipments();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isMobile = useIsMobile();

  // Filter shipments
  const filteredShipments = shipments.filter((shipment: Shipment) => {
    const matchesSearch =
      searchTerm === '' ||
      shipment.containerNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.consignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.commodity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalShipments = shipments.length;
  const pendingCount = shipments.filter((s: Shipment) => s.status === 'PENDING').length;
  const doneCount = shipments.filter((s: Shipment) => s.status === 'DONE').length;

  const handleAddShipment = (data: ShipmentFormData) => {
    addShipment(data);
    setIsFormOpen(false);
  };

  const handleEditShipment = (data: ShipmentFormData) => {
    if (editingShipment) {
      updateShipment(editingShipment._id || editingShipment.id!, data);
      setEditingShipment(null);
      setIsFormOpen(false);
    }
  };

  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDetailsOpen(true);
  };

  const handleEditClick = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setIsFormOpen(true);
  };

  const handleDeleteShipment = (id: string) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      deleteShipment(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* User Info Bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Logged in as <strong className="text-foreground">{user?.email}</strong></span>
            {isAdmin && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                Admin
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Shipments"
            value={totalShipments}
            icon={Package}
            variant="primary"
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Completed"
            value={doneCount}
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        <Tabs defaultValue="shipments" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList>
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
              <TabsTrigger value="reports">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="users">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
              )}
            </TabsList>

            <div className="flex items-center gap-2">
              <ExcelImport />
              <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetTrigger asChild>
                  <Button onClick={() => setEditingShipment(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Shipment
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      {editingShipment ? 'Edit Shipment' : 'New Shipment'}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ShipmentForm
                      initialData={editingShipment || undefined}
                      onSubmit={editingShipment ? handleEditShipment : handleAddShipment}
                      onCancel={() => {
                        setIsFormOpen(false);
                        setEditingShipment(null);
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['ALL', 'PENDING', 'DONE'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>

          <TabsContent value="shipments">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No shipments found</p>
              </div>
            ) : isMobile ? (
              <div className="space-y-3">
                {filteredShipments.map((shipment: Shipment) => (
                  <MobileShipmentCard
                    key={shipment._id || shipment.id}
                    shipment={shipment}
                    onView={handleViewShipment}
                    onEdit={handleEditClick}
                    onDelete={(id) => handleDeleteShipment(id)}
                  />
                ))}
              </div>
            ) : (
              <ShipmentTable
                shipments={filteredShipments}
                onView={handleViewShipment}
                onEdit={handleEditClick}
                onDelete={handleDeleteShipment}
                onToggleStatus={(id) => toggleStatus(id)}
              />
            )}
          </TabsContent>

          <TabsContent value="reports">
            <ReportsAnalytics shipments={shipments} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users">
              <AdminUserManagement />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Shipment Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Shipment Details</SheetTitle>
          </SheetHeader>
          {selectedShipment && (
            <ShipmentDetails
              shipment={selectedShipment}
              onClose={() => setIsDetailsOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
```

### client/src/pages/NotFound.tsx

```tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ship, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <Ship className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
```

---

## COMPONENTS

### client/src/components/Header.tsx

```tsx
import { Ship, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const Header = ({ searchTerm, onSearchChange }: HeaderProps) => {
  return (
    <header className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Ship className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Freight Link Logistics</h1>
              <p className="text-xs text-secondary-foreground/70">Forwarding Agency Management</p>
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### client/src/components/StatCard.tsx

```tsx
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const StatCard = ({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) => {
  const variantStyles = {
    default: 'bg-card border-border',
    primary: 'bg-primary/5 border-primary/20',
    success: 'bg-green-500/5 border-green-500/20',
    warning: 'bg-yellow-500/5 border-yellow-500/20',
  };

  const iconStyles = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-500/10 text-green-600',
    warning: 'bg-yellow-500/10 text-yellow-600',
  };

  return (
    <div className={cn(
      'p-6 rounded-xl border shadow-sm transition-all hover:shadow-md',
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
```

### client/src/components/MobileShipmentCard.tsx

```tsx
import { Shipment } from '@/types/shipment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Edit, Trash2, Container, Calendar, Building2, Package, Plane, Ship } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileShipmentCardProps {
  shipment: Shipment;
  onView: (shipment: Shipment) => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: string) => void;
}

const MobileShipmentCard = ({ shipment, onView, onEdit, onDelete }: MobileShipmentCardProps) => {
  const shipmentId = shipment._id || shipment.id;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Container className="h-4 w-4 text-primary shrink-0" />
              <span className="font-mono font-medium text-sm">{shipment.containerNo || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(shipment.date).toLocaleDateString()}</span>
              <Badge variant="outline" className="font-mono text-xs ml-1">
                {shipment.containerSize || '--'}'
              </Badge>
            </div>
          </div>
          <Badge
            className={cn(
              'shrink-0',
              shipment.status === 'DONE' ? 'bg-green-500' : 'bg-yellow-500'
            )}
          >
            {shipment.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-2">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Consignee</p>
              <p className="text-sm font-medium truncate">{shipment.consignee}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Package className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Commodity</p>
              <p className="text-sm truncate">{shipment.commodity}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Badge variant={shipment.type === 'FCL' ? 'default' : 'secondary'} className="text-xs">
            {shipment.type || 'N/A'}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            {shipment.isAirway ? <Plane className="h-3 w-3" /> : <Ship className="h-3 w-3" />}
            {shipment.isAirway ? 'Air' : 'Sea'}
          </Badge>
          <span>•</span>
          <span>{shipment.shippingLine || 'N/A'}</span>
        </div>

        <div className="flex items-center justify-end gap-1 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => onView(shipment)}
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => onEdit(shipment)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-destructive hover:text-destructive"
            onClick={() => shipmentId && onDelete(shipmentId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileShipmentCard;
```

### client/src/App.css

```css
/* Global app styles */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

---

## README.md (Root)

```markdown
# Freight Link Logistics CRM

A full-stack logistics management CRM for freight forwarding agencies.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Query
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/yourusername/freight-link-logistics.git
cd freight-link-logistics
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
\`\`\`

### 3. Frontend Setup

\`\`\`bash
cd client
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
\`\`\`

### 4. Create Admin User

\`\`\`bash
cd server
npm run seed
\`\`\`

Default admin credentials:
- Email: admin@freightlink.com
- Password: admin123456

**Change the password immediately after first login!**

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret for JWT signing | your-secret-key |
| JWT_EXPIRES_IN | Token expiration | 7d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `client`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render

1. Create Web Service
2. Connect GitHub repository
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from .env.example
7. Deploy

### Database → MongoDB Atlas

1. Create free M0 cluster
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for Render)
4. Get connection string
5. Add to backend environment variables

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Shipments
- `GET /api/shipments` - List shipments
- `GET /api/shipments/:id` - Get shipment
- `POST /api/shipments` - Create shipment
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `POST /api/shipments/bulk` - Bulk import
- `GET /api/shipments/stats` - Get statistics

### Documents
- `GET /api/documents/:shipmentId` - List documents
- `POST /api/documents/:shipmentId` - Upload document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/download/:id` - Download document

### Timeline
- `GET /api/timeline/:shipmentId` - Get timeline
- `POST /api/timeline/:shipmentId` - Add event

### Users (Admin)
- `GET /api/users` - List users
- `PUT /api/users/:id/role` - Update role
- `PUT /api/users/:id/status` - Toggle status
- `DELETE /api/users/:id` - Delete user

## Common Issues

### CORS Errors
Ensure `CLIENT_URL` in backend matches your frontend URL.

### MongoDB Connection
- Whitelist your IP in Atlas Network Access
- Use `0.0.0.0/0` for cloud deployments

### JWT Errors
- Check `JWT_SECRET` is set
- Ensure token is passed in Authorization header

## License

MIT
\`\`\`

---

This complete export provides all files needed to deploy independently. Copy each file section to the appropriate path in your project structure.
