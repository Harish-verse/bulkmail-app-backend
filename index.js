const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const SibApiV3Sdk = require("sib-api-v3-sdk");

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://harish:mongodb123@cluster0.ig2c6pi.mongodb.net/passkey?appName=Cluster0").then(function(){
    console.log("connected to DB")
}).catch(function(){
    console.log("failed to connect")
})



app.post("/success", async function(req, res) {
  const msg = req.body.msg;
  const emailList = req.body.emailList;

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new Brevo.TransactionalEmailsApi();

  try {
    for (let i = 0; i < emailList.length; i++) {
      await apiInstance.sendTransacEmail({
        sender: { email: "harishkumar59455@gmail.com", name: "Bulk Mail App" },
        to: [{ email: emailList[i] }],
        subject: "A message from Bulk Mail app",
        textContent: msg,
      });
      console.log("Email sent to: " + emailList[i]);
    }
    res.send(true);
  } catch (error) {
    console.log("Brevo API Error:", error);
    res.send(false);
  }
});

app.listen(PORT,function(){
    console.log("Server Started...."+ PORT)
})
