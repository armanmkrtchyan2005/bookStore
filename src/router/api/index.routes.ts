import { Router } from "express";
import { passwordResetRoute } from "./passwordReset/passwordReset.routes";
import { authorRouter } from "./author/author.routes";
import { userRouter } from "./user/user.routes";
import { bookRouter } from "./book/book.routes";

export const apiRouter = Router();

apiRouter.use("/user", userRouter)
apiRouter.use("/author", authorRouter);
apiRouter.use("/password-reset", passwordResetRoute);
apiRouter.use("/book", bookRouter)
