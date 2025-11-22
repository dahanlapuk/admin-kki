import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { logger } from '../utils/logger';

dotenv.config();

const seedUsers = [
  {
    name: 'Super Admin',
    email: 'superadmin@gmni-depok.org',
    password: 'admin123',
    role: 'superadmin',
    kki: {
      division: 'general',
      isActive: true,
      permissions: ['all'],
    },
  },
  {
    name: 'Kepala KKI',
    email: 'kepala.kki@gmni-depok.org',
    password: 'admin123',
    role: 'admin',
    kki: {
      division: 'general',
      isActive: true,
      permissions: ['all'],
    },
  },
  {
    name: 'Wakil Kepala KKI',
    email: 'wakil.kki@gmni-depok.org',
    password: 'admin123',
    role: 'admin',
    kki: {
      division: 'general',
      isActive: true,
      permissions: ['manage_content', 'approve', 'assign'],
    },
  },
  {
    name: 'Copywriter',
    email: 'copywriter@gmni-depok.org',
    password: 'staff123',
    role: 'staff',
    kki: {
      division: 'copywriter',
      isActive: true,
      permissions: ['create_content', 'edit_content'],
    },
  },
  {
    name: 'Designer',
    email: 'designer@gmni-depok.org',
    password: 'staff123',
    role: 'staff',
    kki: {
      division: 'designer',
      isActive: true,
      permissions: ['create_content', 'edit_content'],
    },
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kki-dashboard');
    logger.info('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    logger.info('Cleared existing users');

    // Insert seed data
    await User.insertMany(seedUsers);
    logger.info('Seed users created successfully');

    logger.info('Database seeding completed!');
    logger.info('Default credentials:');
    logger.info('Superadmin: superadmin@gmni-depok.org / admin123');
    logger.info('Admin: kepala.kki@gmni-depok.org / admin123');
    logger.info('Staff: copywriter@gmni-depok.org / staff123');

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
