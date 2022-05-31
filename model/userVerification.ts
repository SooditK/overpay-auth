import mongoose from "mongoose";

const userOTPVerification = new mongoose.Schema({
  user_id: { type: String, default: null },
  otp: { type: String, default: null },
  created_at: { type: Date },
  expired_at: { type: Date },
});

export default mongoose.model("UserOTPVerification", userOTPVerification);
