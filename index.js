const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("config");
const authRouter = require("./routes/auth.routes");
const profileRouter = require("./routes/profile.routes");
const app = express();
const PORT = config.get("serverPort");
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

const start = async () => {
  const url =
    "mongodb+srv://Oleksii:Anatomia123!@itop1000o.zqina.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  try {
    await mongoose.connect(url);

    app.listen(PORT, () => {
      console.log("Server will run in", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
