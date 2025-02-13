import { NextFunction, Router, Request, Response } from "express";
import BookController from "../controllers/BookController";

const bookRouter: Router = Router();

bookRouter.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BookController.createBook(req, res);
    } catch (error) {
      next(error);
    }
  }
);
bookRouter.get(
  "/get",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BookController.getBooks(req, res);
    } catch (error) {
      next(error);
    }
  }
);
bookRouter.delete(
  "/delete/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BookController.deleteBook(req, res);
    } catch (error) {
      next(error);
    }
  }
);
bookRouter.patch(
  "/update/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BookController.updateBook(req, res);
    } catch (error) {
      next(error);
    }
  }
);
bookRouter.post(
  "/createBA",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BookController.createBookAuthor(req, res);
    } catch (error) {
      next(error);
    }
  }
);
bookRouter.get(
  "/getBA",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BookController.getBookAuthors(req, res);
    } catch (error) {
      next(error);
    }
  }
);
bookRouter.delete(
  "/deleteBA/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BookController.deleteBookAuthor(req, res);
    } catch (error) {
      next(error);
    }
  }
);
bookRouter.patch(
  "/updateBA/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BookController.updateBookAuthor(req, res);
    } catch (error) {
      next(error);
    }
  }
);
bookRouter.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BookController.searchBook(req, res);
    } catch (error) {
      next(error);
    }
  }
);
export default bookRouter;
