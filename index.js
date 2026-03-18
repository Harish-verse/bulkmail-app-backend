const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://harish:mongodb123@cluster0.ig2c6pi.mongodb.net/passkey?appName=Cluster0").then(function(){
    console.log("connected to DB")
}).catch(function(){
    console.log("failed to connect")
})

var credential = mongoose.model("credential",{},"bulkmail")


app.post("/success",function(req,res){

    var msg = req.body.msg
    var emailList = req.body.emailList

   credential.find().then(function(data){
    
    // Create a transporter using Ethereal test credentials.
   // For production, replace with your actual SMTP server details.
    const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
    user: data[0].toJSON().user,
    pass: data[0].toJSON().pass,
  },
});


        new Promise( async function(resolve,reject)
    {
            try{
        for (let i = 0; i < emailList.length; i++)
         {
             await transporter.sendMail(
            {
              from:"hkumar59455@gmail.com",
              to:emailList[i],
              subject:"A message from Bulk Mail app",
              text:msg
            }
            )
            console.log("Email sent to:"+emailList[i])
         }
              
         resolve("success")
    }
    catch(error)
    {
        console.log("MAIL ERROR",error)
        reject("failed")
    }

    }).then(function(){
        res.send(true)
    }).catch(function(){
        res.send(false)
    })

}).catch(function(error){
    console.log(error)
})
   
})

app.listen(PORT,function(){
    console.log("Server Started...."+ PORT)
})
