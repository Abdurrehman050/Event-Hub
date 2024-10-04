const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const adRouter = require("./routes/adRouter");
const chatRouter = require("./routes/chatRouter");
const offerRouter = require("./routes/offerRouter");
const favoritesRouter = require("./routes/favoritesRoutes");
const catererRouter = require("./routes/catererRouter");
const app = express();

//! Connect to mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

//! Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

//! Middlewares
app.use(express.json()); //? Pass incoming json data
app.use(cookieParser()); // pass the cookie automatically
//! CORS Setup
const corsOptions = {
  origin: ["http://localhost:3000", "http://192.168.10.42:3000/"],
  credentials: true,
};
app.use(cors(corsOptions));
//! Routes
app.use("/", userRouter);
app.use("/", adRouter);
app.use("/", chatRouter);
app.use("/", offerRouter);
app.use("/", favoritesRouter);
app.use("/", catererRouter);

//! Error Handling
app.use(errorHandler);

//! Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`server is running on ${PORT}`));
