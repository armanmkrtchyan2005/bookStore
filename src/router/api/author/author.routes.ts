import { Router } from "express";
import authorController from "../../../controller/author.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { authAuthorMiddleware } from "../../../middleware/authAuthor.middleware";

export const authorRouter = Router();

authorRouter.post("/registration", authorController.registration);
authorRouter.post("/login", authorController.login);
authorRouter.get("/", authAuthorMiddleware, authorController.getAuthors);
authorRouter.get(
  "/referralLink",
  authMiddleware,
  authorController.referralLink
);
authorRouter.get("/:authorId", authorController.getAuthor);
authorRouter.delete("/:id", authMiddleware, authorController.deleteUser);
