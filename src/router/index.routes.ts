import { Router } from "express";
import { apiRouter } from "./api/index.routes";

export const router = Router();

router.use("/api/v2", apiRouter);
