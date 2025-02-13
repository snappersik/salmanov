import { NextFunction, Router, Request, Response } from "express";
import AuthorController from "../controllers/AuthorController";

const authorRouter = Router();

authorRouter.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await AuthorController.createAuthor(req, res);
    } catch (error) {
        next(error);
    }
});
authorRouter.get('/get', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await AuthorController.getAuthors(req, res);
    } catch (error) {
        next(error);
    }
});
authorRouter.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await AuthorController.deleteAuthor(req, res);
    } catch (error) {
        next(error);
    }
});
authorRouter.patch('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await AuthorController.updateAuthor(req, res);
    } catch (error) {
        next(error);
    }
});
authorRouter.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AuthorController.searchAuthor(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default authorRouter;