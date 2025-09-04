import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectToDatabase } from '../utils/db.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { users, tasksFor } from './data.js';

async function run() {
  await connectToDatabase();

  await Promise.all([Task.deleteMany({}), User.deleteMany({})]);

  const createdUsers = [];
  for (const u of users) {
    const passwordHash = await User.hashPassword(u.password);
    const user = await User.create({ name: u.name, email: u.email, passwordHash });
    createdUsers.push(user);
  }

  for (const u of createdUsers) {
    await Task.insertMany(tasksFor(u._id));
  }

  console.log('Seed completed:', {
    users: createdUsers.map((u) => ({ id: u._id, email: u.email })),
  });

  await mongoose.connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


