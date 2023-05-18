import adminController from "../../../controller/admin.controller";
import { Router } from "express";

export const adminRouter = Router();

adminRouter.post("/registration", adminController.registration);
adminRouter.post("/login", adminController.login);
