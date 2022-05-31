import userVerification from "../../model/userVerification";
import { otpVerificationEmail } from "../../utils/OTPfunction";
import { Request, Response } from "express";

const nashe = {
  resend: async (req: Request, res: Response) => {
    try {
      let { userid, email } = req.body;
      if (!userid || !email) {
        return res.json({ success: false, message: "Please enter all fields" });
      }
      // delete the verification
      await userVerification.deleteOne({ user_id: userid });
      otpVerificationEmail({ _id: userid, email }, res);
    } catch (err) {
      console.log(err);
      return res.json({ success: false, message: "Something went wrong" });
    }
  },
};

export default nashe;
