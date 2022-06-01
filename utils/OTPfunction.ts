import "dotenv/config";
import { Response } from "express";
import bcrypt from "bcryptjs";
import userVerification from "../model/userVerification";
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

interface OTPVerificationProps {
  _id: string;
  email: string;
}

export const otpVerificationEmail = async (
  { _id, email }: OTPVerificationProps,
  res: Response
) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<h1>Verify Your Email</h1>
        <p>Please use the following OTP to verify your email</p>
        <p>OTP: ${otp}</p>
        <p>This OTP will expire in 1 hour</p>
        <p>Thank you</p>`,
    };
    // hash the otp
    const salt = 10;
    const hashedOTP = await bcrypt.hash(String(otp), salt);
    const newOTPVerification = await new userVerification({
      user_id: _id,
      otp: hashedOTP,
      created_at: new Date(),
      expired_at: new Date(new Date().getTime() + 3600000),
    });
    await newOTPVerification.save();
    // send the email
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.json({
      success: true,
      status: "Pending",
      message: "OTP sent",
      data: { userid: _id, email: email },
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      status: "Failed",
      message: "Failed to send OTP",
      error: err,
    });
  }
};
