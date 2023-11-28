const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Define the folder containing your text files as a static directory
const folderPath = path.join(__dirname, 'genres');
app.use(express.static(folderPath));

// Set up CORS to allow requests from localhost only
const corsOptions = {
  origin: 'http://localhost:63342', // Allow requests only from localhost
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
