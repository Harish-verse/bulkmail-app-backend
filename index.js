const express = require("express");
const cors = require("cors");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://harish:mongodb123@cluster0.ig2c6pi.mongodb.net/passkey?appName=Cluster0").then(function(){
    console.log("connected to DB")
}).catch(function(){
    console.log("failed to connect")
})


app.post("/success",async function(req,res){
 try{
  console.log("BODY:", req.body)
     const {msg,emailList} = req.body

   const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    
           for (let i = 0; i < emailList.length; i++)
         {
             await tranEmailApi.sendTransacEmail({
                   sender: { email: "harishkumar59455@gmail.com" },
                   to: [{ email: emailList[i] }],
                   subject: "A message from Bulk Mail app",
                   textContent: msg
                });
            console.log("Email sent to:"+emailList[i])
         }
            res.send(true)      
    }     
   catch(error)
    {
        console.log("MAIL ERROR",error)
        res.send(false)
    }

    }) 
      

app.listen(PORT,function(){
    console.log("Server Started...."+ PORT)
})
