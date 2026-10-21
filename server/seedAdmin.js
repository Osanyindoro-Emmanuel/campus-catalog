import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import AdminUser from './src/models/AdminUser.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_catalog';

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully.');

    const existingAdmin = await AdminUser.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log(`Admin user already exists with username: "admin" (ID: ${existingAdmin._id})`);
      await mongoose.disconnect();
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const newAdmin = new AdminUser({
      username: 'admin',
      passwordHash,
    });

    await newAdmin.save();
    console.log('Admin user created successfully!');
    console.log('  Username: admin');
    console.log('  Password: admin123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin user:', error.message);
    process.exit(1);
  }
}

seedAdmin();

