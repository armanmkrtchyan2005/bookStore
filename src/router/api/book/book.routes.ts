import { Router } from "express";
import multer from "multer";
import os from "os";
import bookController from "../../../controller/book.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";

export const bookRouter = Router();

const upload = multer({ dest: os.tmpdir() });

bookRouter.post(
  "/",
  authMiddleware,
  upload.fields([{ name: "img", maxCount: 1 }, { name: "chapters" }]),
  bookController.createBook
);
bookRouter.post(
  "/chapter",
  authMiddleware,
  upload.single("chapter"),
  bookController.addChapter
);
bookRouter.get("/", bookController.getBooks);
bookRouter.put("/percent", bookController.setChapterPercent);
bookRouter.get("/percent", bookController.getChaptersPercents);
bookRouter.put("/showCount", bookController.setShowedCount);
bookRouter.get("/genres", bookController.getGenres);
bookRouter.post("/genres", authMiddleware, bookController.createGenre);
bookRouter.delete("/genres/:id", authMiddleware, bookController.deleteGenre);
bookRouter.get("/:bookId", bookController.getBook);
bookRouter.delete("/:id", authMiddleware, bookController.deleteBook);
