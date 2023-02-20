const express = require("express");
const { connection } = require("./db");
const { UserRouter } = require("./Routes/users.routes");
const { PostRouter } = require("./Routes/posts.routes");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/users", UserRouter);
app.use("/posts", PostRouter);

app.listen(4500, async () => {
  await connection;
  console.log("Db is Connected & Server is Running");
});
