import "dotenv/config";
import express from "express";
const router = express.Router();
import {
  register,
  login,
  resendotp,
  verifyotp,
} from "../controllers/auth.controller";

router.post("/register", register.register);

router.post("/login", login.login);

router.post("/verifyotp", verifyotp.verifyotp);

router.post("/resendotp", resendotp.resend);

export default router;
