const express = require('express');
const app = express();
const env = require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Hello world');
});

const port = process.env.PORT || 8000;
console.log(port);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
