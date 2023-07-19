const verifyToken = require("../middlewares/verifyToken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const userRouter = require("express").Router();

userRouter.get("/find/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new Error("Invalid userId");
    }
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

userRouter.get("/findAll", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      throw new Error("No Users");
    }
    const formattedusers = users.map((users) => {
      return {
        username: users.username,
        email: users.email,
        _id: users._id,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      };
    });
    return res.status(200).json(formattedusers);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

userRouter.put("/updateUser/:userId", verifyToken, async (req, res) => {
  if (req.params.userId === req.user.id) {
    try {
      if (req.body.password) {
        req.body = await bcrypt.hash(req.body.password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  } else {
    return res.status(403).json({ msg: "You can only update your profile" });
  }
});

userRouter.delete("/deleteUser/:userId", verifyToken, async (req, res) => {
  if (req.params.userId === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.userId);
      return res.status(200).json({ msg: "Successfully Deleted" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  } else {
    return res.status(403).json({ msg: "You can only delete your profile" });
  }
});

module.exports = userRouter;
