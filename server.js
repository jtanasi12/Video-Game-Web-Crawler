const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises; // Use fs.promises for async/await
const app = express();
const PORT = 3000;

// Define the folder containing your text files as a static directory
//const htmlFolderPath = path.join(__dirname, 'genres');
//app.use(express.static(htmlFolderPath));

app.use(express.static('Public'));
app.use(express.json()); // Use express.json() instead of body-parser

// The default URL ='s localhost:3000 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Public/opening-page.html');
});

// This is where presentation once it recieves via the url the genre 
// It uses a fetch request to call this, in nodejs we can read the file 
// in the browser security measurements doesn't allow us to do so
app.post('/loadTxtFile', async (req, res) => {
  const genre = req.body.genre;

  console.log('Genre:', genre);

  const genresFolderPath = path.join(__dirname, 'genres');
  const filePath = path.join(genresFolderPath, `${genre}`);

  // read the file
  try {
    // Read the content of the text file
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse the JSON content
    const parsedContent = JSON.parse(fileContent);

    // Do something with the parsed content (for now, just log it)
    console.log('Parsed Content:', parsedContent);

    // Send the response with the parsed content, this gets set back to presentation 
    res.json({ message: 'Load Text File Call Success', content: parsedContent });
  } catch (error) {
    console.error('Error reading or parsing the file:', error);
    // Send an error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set up CORS to allow requests from localhost only
//const corsOptions = {
// origin: 'http://localhost', // Allow requests only from localhost
//optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
//};
//app.use(cors(corsOptions));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
