import { Request, Response } from "express";
import { Author } from "../models/atBook/Author";
import mongoose from "mongoose";

export default class AuthorController {
  static async createAuthor(req: Request, res: Response) {
    try {
      const { firstName }: { firstName: string } = req.body;
      const author = new Author({ firstName });
      await author.save();
      return res.status(201).json({ msg: "Автор успешно добавлен" });
    } catch (error) {
      console.error("Ошибка при создании автора:", error);
      return res.status(400).json({ error });
    }
  }

  static async getAuthors(req: Request, res: Response) {
    try {
      const authors = await Author.find();
      return res.status(200).json({ authors });
    } catch (error) {
      console.error("Ошибка при получении автора:", error);
      return res
        .status(500)
        .json({ error: "Не удалось получить список авторов" });
    }
  }

  static async deleteAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Невалидный ID автора" });
      }
      const deleteAuthor = await Author.findByIdAndDelete(id);
      if (!deleteAuthor) {
        return res.status(404).json({ error: "Автор не найден" });
      }
      return res.status(200).json({ msg: "Автор успешно удален" });
    } catch (error) {
      return error;
    }
  }
  static async updateAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { firstName } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Невалидный ID автора" });
      }
      const updateAuthor = await Author.findByIdAndUpdate(
        id,
        { firstName },
        { new: true, runValidators: true }
      );
      if (!updateAuthor) {
        return res.status(404).json({ error: "Автор не найден" });
      }
      return res.status(200).json({ msg: "Автор успешно обновлен " });
    } catch (error) {
      return error;
    }
  }
  static async searchAuthor(req: Request, res: Response) {
    try {
      const { firstName } = req.query;

      if (!firstName) {
        return res
          .status(400)
          .json({ error: "Пожалуйста, укажите поисковый запрос." });
      }
      const author = await Author.find({
        firstName: { $regex: firstName, $options: "i" }, // 'i' делает поиск нечувствительным к регистру
      });
      return res.status(200).json({ author });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
