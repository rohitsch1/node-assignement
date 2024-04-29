const express = require('express');
const router = express.Router();
const authorController= require("../controller/authController")
const { uploadFileHandler, upload, getFile ,deleteFile} = require('../controller/fileUploadController')
const { authentication ,authorisation} = require('../middleware/auth')

const auth = require ('../middleware/auth')


//test API
router.get('/test-me',function(req,res){
    res.send({msg : "test done "})
})


// creating author And Blogs 
router.post("/api/auth/register", authorController.createUser)

// login API
router.post('/api/auth/login',authorController.login)
router.get('/api/auth/logout',authorController.logout)

// // get and update API 
router.post('/upload',authentication , upload.single('file'), uploadFileHandler);
router.get("/file/:userId",authentication, getFile)


// delete API's
router.delete('/file/:userId',authentication, authorisation, deleteFile)

module.exports=router




