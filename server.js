const express = require("express");
const port = 4000;
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./router");
const url_local =
  "mongodb+srv://wrsMKqHXcLIdob5I:wrsMKqHXcLIdob5I@cluster0.vxqcy.mongodb.net/BlogApi?retryWrites=true&w=majority";
const app = express();

mongoose
  .connect(url_local, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log("Error While connnecting");
  });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blogger Api");
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`${port} is listening`);
});
