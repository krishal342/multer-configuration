import express, { urlencoded } from 'express';
import multer from 'multer';
import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/config.js';

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));



// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(urlencoded({ extended: true }));


// multer configuration

const uploadPath = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });


// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file') , (req, res) => {
    try{
        console.log(req.file);
        res.send('File uploaded successfully');

    }catch(err){
        console.log("Error: " + err);
    }
});



// listening port
app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));