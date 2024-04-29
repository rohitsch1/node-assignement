const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileModel = require('../models/file');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    // Define allowed file types
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'];

    // Check if the uploaded file's mimetype is included in the allowed types
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, and MP4 files are allowed.'));
    }
  }
});


// Define a separate function for upload logic
const uploadFileHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;

    // Save the file information to your database or perform any other necessary operations
    const fileInfo = {
      filename: file.filename,
      originalFilename: file.originalname,
      userId: req.userId, // Assuming you have user ID in the token payload
      path: file.path,
      size: file.size,
    };
    await fileModel.create(fileInfo); // Assuming fileModel has a create method
    // Send a success response
    res.status(200).json({ message: 'File uploaded successfully', file: fileInfo });
  } catch (err) {
    // Handle errors
    console.error(err);
    fs.unlinkSync(req.file.path); // Delete the uploaded file
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

const getFile = async (req, res)=>{
  try {
    const file = await fileModel.find({userId : req.params.userId});
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.status(200).json({ file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get file' });
  }
}

const deleteFile = async (req, res) => {
  try {
    // finding the file by name and the deleting the file
    const deletedFile = await fileModel.findOneAndDelete({filename : req.query.filename});

    if (!deletedFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file from the filesystem
    fs.unlinkSync(deletedFile.path);

    // Respond with success message
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};


module.exports = { uploadFileHandler, upload , getFile , deleteFile};
