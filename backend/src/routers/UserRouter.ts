import { NextFunction, Router, Request, Response } from "express";
import UserController from "../controllers/UserController";
import AuthMiddleWare from "../middleware/AuthMiddleWare";

const userRouter = Router();

userRouter.post(
  "/registration",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.createUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);
userRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.login(req, res);
    } catch (error) {
      next(error);
    }
  }
);
userRouter.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AuthMiddleWare.verifyUser, UserController.logout(req, res);
    } catch (error) {
      next(error);
    }
  }
);
userRouter.get(
  "/profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AuthMiddleWare.verifyUser, UserController.getProfile(req, res);
    } catch (error) {
      next(error);
    }
  }
);
userRouter.get(
  "/get",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.getUsers(req, res);
    } catch (error) {
      next(error);
    }
  }
);
userRouter.delete(
  "/delete/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.deleteUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);
userRouter.patch(
  "/update/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.updateUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);
userRouter.put(
  "/admin/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.addAdmin(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
