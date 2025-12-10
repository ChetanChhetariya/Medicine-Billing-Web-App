const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function clearDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Delete all medicines
    const medicinesResult = await mongoose.connection.db.collection('medicines').deleteMany({});
    console.log(`🗑️  Deleted ${medicinesResult.deletedCount} medicines`);
    
    // Delete all invoices
    const invoicesResult = await mongoose.connection.db.collection('invoices').deleteMany({});
    console.log(`🗑️  Deleted ${invoicesResult.deletedCount} invoices`);
    
    console.log('✅ Database cleared successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

clearDatabase();