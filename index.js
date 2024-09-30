const PORT = '8080'; // 8080 포트를 사용
const express = require('express'); // express 모듈 사용
const cors = require('cors'); // cors 모듈 사용
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer'); // multer 모듈 사용
const spawn = require('child_process').spawn;

const app = express(); // express 모듈을 app 변수 할당

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'https://travel-planner-front.aicclionnoil.co.kr',
    // origin: 'http://localhost:3000',
    credentials: true,
  })
);

// app.use(cors());

app.get('/', (req, res) => {
  res.send(' Thanks for all of your warmth and kindness !!');
});

app.post('/chat', (req, res) => {
  try {
    const sendedQuestion = req.body.question;

    // EC2 서버에서 현재 실행 중인 Node.js 파일의 절대 경로를 기준으로 설정.
    const scriptPath = path.join(__dirname, 'mychat.py');

    // EC2 서버에서 실행하는 절대 경로: 개발 테스트 시 사용 불가
    const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3');

    // 윈도우 개발 테스트 시 사용하는 절대 경로
    // const pythonPath = path.join(__dirname, 'venv', 'Scripts', 'python.exe');

    // Spawn the Python process with the correct argument
    const result = spawn(pythonPath, [scriptPath, sendedQuestion]);

    // result.stdout.on('data', (data) => {
    //   console.log(data.toString());
    //   // return res.status(200).json(data.toString());
    // });

    let responseData = '';

    // Listen for data from the Python script
    result.stdout.on('data', (data) => {
      // console.log(data.toString());
      // res.status(200).json({ answer: data.toString() });
      responseData += data.toString();
    });

    // Listen for errors from the Python script
    result.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).json({ error: data.toString() });
    });

    // Handle the close event of the child process
    result.on('close', (code) => {
      if (code === 0) {
        res.status(200).json({ answer: responseData });
      } else {
        res
          .status(500)
          .json({ error: `Child process exited with code ${code}` });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.use(cookieParser());

// 'uploads' 폴더를 정적 파일로 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer 설정: 파일 저장 위치와 파일 이름 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 파일을 uploads 폴더에 저장
  },
  filename: function (req, file, cb) {
    const fullName =
      req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    cb(null, fullName + '_' + file.filename); // 파일 이름 설정 (중복 방지를 위해 타임스탬프 추가)
  },
});

const upload = multer({ storage: storage });

// 라우트 사용
app.post('/upload', upload.single('planner_img'), (req, res) => {
  try {
    res.status(200).json({
      message: 'File uploaded successfully',
      filename:
        req.protocol +
        '://' +
        req.get('host') +
        '/uploads/' +
        req.file.filename,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'File upload failed', error: error.message });
  }
});

// 다른 라우트 설정
app.use(require('./routes/getRoutes'));
app.use(require('./routes/postRoutes'));
app.use(require('./routes/updateRoutes'));
app.use(require('./routes/deleteRoutes'));

app.listen(PORT, () => console.log(`Server is running on ${PORT}`)); // 서버 실행 시 메시지 출력
