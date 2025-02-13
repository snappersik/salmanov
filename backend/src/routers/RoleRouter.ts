import { NextFunction, Router, Request, Response } from "express";
import RoleController from "../controllers/RoleController";

const roleController = Router();

roleController.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await RoleController.createRole(req, res);
    } catch (error) {
      next(error);
    }
  }
);
roleController.get(
  "/get",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await RoleController.getRoles(req, res);
    } catch (error) {
      next(error);
    }
  }
);
roleController.delete(
  "/delete/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await RoleController.deleteRole(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default roleController;
