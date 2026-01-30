const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();


app.use(express.json()); 

app.use(cors()); 
// for frontend and backend connection
// DB connections
mongoose.connect(process.env.DB_URI)
  .then(() => console.log("MongoDB connected successfully !!! "))
  .catch((err) => console.error("MongoDB connection error:", err));


  app.use('/auth', authRoutes);
//any request starting with /auth should go to authRoutes


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});