import user from "../../model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const nashe = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.json({ success: false, message: "Please enter all fields" });
      }
      const oldUser = await user.findOne({ email });
      if (!oldUser) {
        return res.json({ success: false, message: "User does not exist" });
      }
      if (oldUser && (await bcrypt.compare(password, oldUser.password))) {
        const token = jwt.sign(
          { user_id: oldUser._id, email },
          process.env.TOKEN_KEY as string,
          {
            expiresIn: "1h",
          }
        );
        oldUser.token = token;
        await oldUser.save();
        return res.json({
          success: true,
          message: "User logged in successfully",
          user: oldUser,
        });
      } else {
        return res.json({ success: false, message: "Incorrect Credentials" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ success: false, message: "Something went wrong" });
    }
  },
};

export default nashe;
