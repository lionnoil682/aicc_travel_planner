const express = require('express');
const cors = require('cors');
const path = require('path');
const { error } = require('console');
const spawn = require('child_process').spawn;
const PORT = 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`server is running on ${PORT}`));

app.get('/', (request, response) => {
  response.send('Hello From Node Server');
});

app.get('/random/:content', (request, response) => {
  const scriptPath = path.join(__dirname, 'resolver.py');
  const pythonPath = path.join(__dirname, 'venv', 'Scripts', 'python.exe');

  const result = spawn(pythonPath, [scriptPath]);

  let responseData = '';

  result.stdout.on('data', function (data) {
    output += data.toString();
  });

  result.on('close', (code) => {
    if (code === 0) {
      const jsonResponse = JSON.parse(responseData);
      res.status(200).json({ jsonResponse });
    } else {
      res.status(500).json({ error: `CHild process exited with code ${code}` });
    }
  });

  result.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});

app.get('/latest/:count', (request, response) => {
  response.send('latest request');
});

app.get('/genres/:genre/:count', (request, response) => {
  response.send('genres request');
});

// app.use(require('./routes/getRoutes'));
// app.use(require('./routes/postRoutes'));
// app.use(require('./routes/deleteRoutes'));
// app.use(require('./routes/updateRoutes'));
