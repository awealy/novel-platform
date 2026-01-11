const functions = require('firebase - functions');
const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer();
const { getFirestore } = require('firebase - admin/firestore');
const { getStorage } = require('firebase - admin/storage');

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const storage = getStorage();
  const bucket = storage.bucket();
  const fileUpload = bucket.file(`novels/${file.originalname}`);
  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  stream.write(file.buffer);
  stream.end();

  stream.on('error', (err) => {
    console.error('Error uploading file:', err);
    res.status(500).send('Error uploading file');
  });

  stream.on('finish', async () => {
    const db = getFirestore();
    const novelRef = db.collection('novels').doc(file.originalname);
    const downloadURL = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03 - 01 - 2500'
    });

    await novelRef.set({
      name: file.originalname,
      url: downloadURL[0],
      type: file.mimetype
    });

    res.status(200).send('File uploaded successfully');
  });
});

exports.api = functions.https.onRequest(app);