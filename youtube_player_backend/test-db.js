const mongoose = require('mongoose');

// Manually replace <password> below with your actual password
const testUri = "mongodb+srv://Ananya:Atler456@mycluster1.4tqzlhf.mongodb.net/test?retryWrites=true&w=majority";

console.log("Attempting to connect to MongoDB...");

mongoose.connect(testUri)
  .then(() => {
    console.log("✅ Connection Successful!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection Failed!");
    console.error("Error Message:", err.message);
    process.exit(1);
  });