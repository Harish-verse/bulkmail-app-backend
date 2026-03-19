const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://harish:mongodb123@cluster0.ig2c6pi.mongodb.net/passkey?appName=Cluster0")
.then(() => console.log("connected to DB"))
.catch((err) => console.log("failed to connect", err));

// Schema (using existing collection)
const credential = mongoose.model("credential", {}, "bulkmail");

// API Route
app.post("/success", async (req, res) => {
  try {

    const { msg, emailList } = req.body;

    const data = await credential.find();

    const apiKey = data[0].toJSON().pass; // Resend API key

    const resend = new Resend(apiKey);

    for (let i = 0; i < emailList.length; i++) {
      const response = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: emailList[i],
        subject: "Bulk Mail App",
        text: msg,
      });

      console.log("Email sent to:", emailList[i]);
    }

    res.send(true);

  } catch (error) {
    console.log("MAIL ERROR:", error);
    res.status(500).send(false);
  }
});

app.listen(PORT, () => {
  console.log("Server Started...." + PORT);
});
