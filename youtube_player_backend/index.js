require("dotenv").config();   //  loads .env
require("./src/config/redis");

const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();                  //  connect DB here

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
