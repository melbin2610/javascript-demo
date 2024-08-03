const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
// Serve static images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Load server data
const servers = require('../data/data.json');

// Endpoint to get all servers
app.get('/api/servers', (req, res) => {
  res.json(servers);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
