import User from "../models/user";
import Post from "../models/post";

import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

const createUser = async ({ userInput }: any, req: any) => {
  const existingUser = await User.findOne({ email: userInput.email });
  const errors = [];

  if (!validator.isEmail(userInput.email)) {
    errors.push({ message: "E-mail is invalid" });
  }

  if (
    validator.isEmpty(userInput.password) ||
    !validator.isLength(userInput.password, { min: 5 })
  ) {
    errors.push({ message: "Password is too short!" });
  }

  if (errors.length > 0) {
    const error: any = new Error("Invalid Input");
    error.data = errors;
    error.code = 400;
    throw error;
  }

  if (existingUser) {
    const error = new Error("User already exists");
    throw error;
  }
  const hashedPw = await bcrypt.hash(userInput.password, 12);
  const createdUser = await User.create({
    email: userInput.email,
    name: userInput.name,
    password: hashedPw,
  });
  return { ...createdUser._doc, _id: createdUser._id.toString() };
};

const login = async ({ email, password }: any, req: any) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    const error: any = new Error("User not found.");
    error.code = 401;
    throw error;
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error: any = new Error("Password is incorrect.");
    error.code = 401;
    throw error;
  }
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    "somesupersecretsecret",
    { expiresIn: "1h" }
  );

  return {
    token,
    userId: user._id.toString(),
  };
};

const createPost = async ({ postInput }: any, req: any) => {
  if (!req.isAuth) {
    const error: any = new Error("Not authenticated");
    error.code = 401;
    throw error;
  }
  const errors = [];
  if (
    validator.isEmpty(postInput.title) ||
    !validator.isLength(postInput.title, { min: 5 })
  ) {
    errors.push({ message: "Title is invalid" });
  }
  if (
    validator.isEmpty(postInput.content) ||
    !validator.isLength(postInput.content, { min: 5 })
  ) {
    errors.push({ message: "Content  is invalid" });
  }
  if (errors.length > 0) {
    const error: any = new Error("Invalid Input");
    error.data = errors;
    error.code = 400;
    throw error;
  }
  const user = await User.findById(req.userId);
  if (!user) {
    const error: any = new Error("Invalid user");
    error.code = 401;
    throw error;
  }
  const createdPost = await Post.create({
    title: postInput.title,
    content: postInput.content,
    imageUrl: postInput.imageUrl,
    creator: user,
  });

  user.posts.push(createdPost);

  await user.save();

  return {
    ...createdPost._doc,
    _id: createdPost._id.toString(),
    createdAt: createdPost.createdAt.toISOString(),
    updatedAt: createdPost.updatedAt.toISOString(),
  };
};

const posts = async (args: any, req: any) => {
  if (!req.isAuth) {
    const error: any = new Error("Not authenticated");
    error.code = 401;
    throw error;
  }
  const totalPosts = await Post.countDocuments({});
  const posts = await Post.find({}).sort({ createdAt: -1 }).populate("creator");

  return {
    posts: posts.map((post: any) => ({
      ...post._doc,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    })),
    totalPosts,
  };
};

export default {
  createUser,
  login,
  createPost,
  posts,
};
