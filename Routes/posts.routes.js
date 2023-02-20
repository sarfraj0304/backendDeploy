const { Router } = require("express");
const PostRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { postModel } = require("../models/post.model");
const { AuthMiddleware } = require("../middleware/auth.middleware");
require("dotenv").config();

PostRouter.get("/", AuthMiddleware, async (req, res) => {
  const { device1, device2, device } = req.query;
  const userID = req.body.userID;
  if (device != undefined) {
    const posts = await postModel.find({
      $and: [{ userID: userID }, { device: device }],
    });
    res.send(posts);
  } else if (device1 != undefined && device2 != undefined) {
    const posts2 = await postModel.find({
      $and: [{ userID: userID }, { device: device1 }],
    });
    const posts3 = await postModel.find({
      $and: [{ userID: userID }, { device: device2 }],
    });
    let app = [posts2, posts3];
    res.send(app);
  } else {
    const posts = await postModel.find({ userID: userID });
    res.send(posts);
  }
});

PostRouter.get("/top", AuthMiddleware, async (req, res) => {
  const topPost = await postModel.find().sort({ no_if_comments: -1 });
  res.send(topPost[0]);
});

PostRouter.post("/create", AuthMiddleware, async (req, res) => {
  try {
    const postsCreate = new postModel(req.body);
    await postsCreate.save();
    res.send({ msg: "Post Created" });
  } catch (error) {
    res.send({ error: error });
  }
});

PostRouter.patch("/update/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;
  await postModel.findByIdAndUpdate({ _id: id }, req.body);
  res.send({ msg: "Post Updated" });
});

PostRouter.delete("/delete/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;
  await postModel.findByIdAndDelete({ _id: id });
  res.send({ msg: "Post Deleted" });
});

module.exports = {
  PostRouter,
};
