const bodyParser = require('body-parser')
const route = require("./route/route")
const express=require('express')
const mongoose=require('mongoose')

const app=express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://Rohitsch:S*Crohit16@cluster0.31aen.mongodb.net/uploads")
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/',route)

app.listen(3000,function(){
    console.log("Server running on port 3000")
})