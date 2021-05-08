import User from "../models/user";
import bcrypt from "bcryptjs";

const createUser = async ({ userInput }: any, req: any) => {
  const existingUser = await User.findOne({ email: userInput.email });
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

export default {
  createUser,
};
