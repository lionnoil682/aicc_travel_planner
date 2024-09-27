const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');

// console.log(path.join(__dirname));

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.post('/chat', (req, res) => {
  const sendQuestion = req.body.question;
  const execPython = path.join(__dirname, 'chat', 'bizchat.py');
  const pythonPath = path.join(__dirname, 'chat', 'Scripts', 'python.exe');
  const net = spawn(pythonPath, [execPython, sendQuestion]);

  output = '';

  //파이썬 파일 수행 결과를 받아온다
  net.stdout.on('data', function (data) {
    output += data.toString();
  });

  net.on('close', (code) => {
    if (code === 0) {
      res.status(200).json({ answer: output });
    } else {
      res.status(500).send('Something went wrong');
    }
  });

  net.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});

app.listen(port, () => {
  console.log('Server is running on port 8000');
});
