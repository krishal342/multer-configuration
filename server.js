import express, { urlencoded } from 'express';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import config from './config/config.js';

// multer configuration
import upload from './utilis/multer-config.js';

// cloudinary
import cloudinary from './utilis/cloudinary.js';


const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(urlencoded({ extended: true }));


// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto', 
            folder: 'multer_uploads' // to organize uploads in a folder
        });

        // Remove local file after upload
        fs.unlinkSync(req.file.path);

        // Send Cloudinary URL back
        res.send('<p>Upload successful!</p> <br> File URL: <a href="' + result.secure_url + '" target="_blank">' + result.secure_url + '</a>');
    } catch (err) {
        fs.unlinkSync(req.file.path);
        res.status(500).send('Upload failed: ' + err.message);
    }
});


// listening port
app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));