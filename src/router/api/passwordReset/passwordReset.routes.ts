import { Router } from "express";
import passwordResetController from "../../../controller/passwordReset.controller";

export const passwordResetRoute = Router();

passwordResetRoute.post("/", passwordResetController.sendEmail);
passwordResetRoute.post("/confirm", passwordResetController.confirmCode);
passwordResetRoute.put(
  "/:userId/:token",
  passwordResetController.resetPassword
);
