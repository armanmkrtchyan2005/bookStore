import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import authorController from "../../../controller/author.controller";
import multer from "multer";
import os from "os";

export const authorRouter = Router();

const upload = multer({
  dest: os.tmpdir(),
});

authorRouter.post("/registration", authorController.registration);
authorRouter.post("/login", authorController.login);
authorRouter.get("/", authorController.getAuthors);
authorRouter.get(
  "/referralLink",
  authMiddleware,
  authorController.referralLink
);
authorRouter.put("/edit", authMiddleware, authorController.editAuthor);
authorRouter.post(
  "/company",
  authMiddleware,
  upload.single("content"),
  authorController.createCompany
);
authorRouter.get("/company", authMiddleware, authorController.getCompanies);
authorRouter.get("/:authorId", authorController.getAuthor);
authorRouter.delete("/:id", authMiddleware, authorController.deleteAuthor);
