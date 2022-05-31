import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import user from "../../model/user";
import userVerification from "../../model/userVerification";
import { otpVerificationEmail } from "../../utils/OTPfunction";

const nashe = {
  register: async (req: Request, res: Response) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      if (!first_name || !last_name || !email || !password) {
        return res.json({ success: false, message: "Please enter all fields" });
      }
      const oldUser = await user.findOne({ email });
      if (oldUser) {
        return res.json({ success: false, message: "User already exists" });
      }
      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = new user({
        first_name,
        last_name,
        email,
        password: encryptedPassword,
        verified: false,
      });
      await newUser.save();
      const newUserVerification = await new userVerification({
        user_id: newUser._id,
        email,
      });
      await newUserVerification.save();
      await otpVerificationEmail(newUserVerification, res);
    } catch (err) {
      console.log(err);
      return res.json({ success: false, message: "Something went wrong" });
    }
  },
};

export default nashe;
