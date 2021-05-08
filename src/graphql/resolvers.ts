import User from "../models/user";
import bcrypt from "bcryptjs";
import validator from "validator";

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
    const error = new Error("Invalid Input");
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

export default {
  createUser,
};
