require('dotenv').config();
const mongoose = require('mongoose');

async function resetDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Dropping database...');
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully.');
  } catch (err) {
    console.error('Error dropping database:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

resetDb();