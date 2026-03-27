const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");


const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://harish:mongodb123@cluster0.ig2c6pi.mongodb.net/passkey?appName=Cluster0").then(function(){
    console.log("connected to DB")
}).catch(function(){
    console.log("failed to connect")
})


app.post("/success", function(req, res) {
  var msg = req.body.msg;
  var emailList = req.body.emailList;

  
  const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

  new Promise(async function(resolve, reject) {
    try {
      for (let i = 0; i < emailList.length; i++) {
        await transporter.sendMail({
          from: "harishkumar59455@gmail.com",
          to: emailList[i],
          subject: "A message from Bulk Mail app",
          text: msg,
        });
        console.log("Email sent to: " + emailList[i]);
      }
      resolve("success");
    } catch (error) {
      console.log(error); 
      reject("failed");
    }
  })
  .then(function() { res.send(true); })
  .catch(function() { res.send(false); });
});


app.listen(PORT,function(){
    console.log("Server Started...."+ PORT)
})
