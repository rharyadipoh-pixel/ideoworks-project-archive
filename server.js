const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.send('ok'));

app.get('/api/projects', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

// Serve index.html for root (explicit, in case static doesn't catch it)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Archive running on port ${PORT}`));
