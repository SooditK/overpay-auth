import userVerification from "../../model/userVerification";
import bcrypt from "bcryptjs";
import user from "../../model/user";
import { Request, Response, NextFunction } from "express";

const nashe = {
  verifyotp: async (req: Request, res: Response) => {
    try {
      const { userid, otp } = req.body;
      if (!userid || !otp) {
        return res.json({ success: false, message: "Please enter all fields" });
      }
      const verification = await userVerification.findOne({ user_id: userid });
      if (verification.length <= 0) {
        return res.json({
          success: false,
          message: "User does not exist or has been verified already",
        });
      } else {
        if (await bcrypt.compare(otp, verification.otp)) {
          if (new Date() > verification.expired_at) {
            // delete the verification
            await userVerification.deleteOne({ user_id: userid });
            return res.json({
              success: false,
              message: "OTP has expired",
            });
          }
          await user.updateOne({ _id: userid }, { verified: true });
          await userVerification.deleteOne({ user_id: userid });
          return res.json({
            success: true,
            status: "Verified",
            message: "User verified successfully",
          });
        } else {
          return res.json({
            success: false,
            message: "OTP does not match",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.json({ success: false, message: "Something went wrong" });
    }
  },
};

export default nashe;
