import { Router } from "express";
import userController from "../../../controller/user.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
export const userRouter = Router();

userRouter.post("/registration", userController.registration);
userRouter.post("/registration/socSites", userController.socSites);
userRouter.post("/login", userController.login);
userRouter.post("/like", authMiddleware, userController.likeBook);
userRouter.get("/like", authMiddleware, userController.getLikedBooks);
userRouter.delete("/like", authMiddleware, userController.deleteLikedBook);
userRouter.post("/follow", authMiddleware, userController.follow);
userRouter.delete("/follow", authMiddleware, userController.unFollow);
userRouter.get("/followings", authMiddleware, userController.followings);
userRouter.get("/reads", userController.getReadsBooks);
userRouter.post("/reads", userController.addReadBook);
userRouter.delete("/reads", userController.deleteReadBook);
userRouter.post("/complain", userController.addComplain);
userRouter.get("/complain", userController.getComplains);
