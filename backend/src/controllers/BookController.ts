import { Request, Response } from "express";
import { Book } from "../models/atBook/Book";
import { BookAuthor } from "../models/atBook/BookAuthor";
import mongoose, { mongo } from "mongoose";

export default class BookController {
  static async createBook(req: Request, res: Response) {
    try {
      const { title } = req.body;
      const book = new Book({ title });
      await book.save();
      return res.status(201).json({ msg: "Success add book" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  static async getBooks(req: Request, res: Response): Promise<Response> {
    try {
      const books = await Book.find();
      return res.status(200).json({ books });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  static async deleteBook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Невалидный ID книги" });
      }
      const deleteBook = await Book.findByIdAndDelete(id);
      if (!deleteBook) {
        return res.status(404).json({ error: "Книга не найдена" });
      }
      return res.status(200).json({ msg: "Книга успешно удалена" });
    } catch (error) {
      return error;
    }
  }
  static async updateBook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Невалидный ID книги" });
      }
      const updateBook = await Book.findByIdAndUpdate(
        id,
        { title },
        { new: true, runValidators: true }
      );
      if (!updateBook) {
        return res.status(404).json({ error: "Книга не найдена" });
      }
      return res.status(200).json({ msg: "Книга успешно обновлена" });
    } catch (error) {
      return error;
    }
  }
  static async createBookAuthor(req: Request, res: Response) {
    try {
      const { book, author } = req.body;
      if (!book || !author) {
        return res.status(400).json({ error: "Поля не должны быть пустыми" });
      }
      const bookAuthor = new BookAuthor({ book, author });
      await bookAuthor.save();
      return res.status(201).json({ msg: "Success add bookAuthor" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  static async getBookAuthors(req: Request, res: Response) {
    try {
      const booksAuthor = await BookAuthor.find();
      return res.status(200).json({ booksAuthor });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  static async deleteBookAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Неправильный ID" });
      }
      const deleteBookAuthor = await BookAuthor.findByIdAndDelete(id);
      if (!deleteBookAuthor) {
        return res.status(404).json({ error: " с таким ID не найдено" });
      }
      return res.status(200).json({ msg: "Успешно удалено" });
    } catch (error) {
      return error;
    }
  }
  static async updateBookAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { book, author } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Невалидный ID" });
      }
      const updateBookAuthor = await BookAuthor.findByIdAndUpdate(
        id,
        {
          book: book,
          author: author,
        },
        { new: true, runValidators: true }
      );
      if (!updateBookAuthor) {
        return res.status(404).json({ error: "Не найден" });
      }
      return res.status(200).json({ msg: "Успешное обновление" });
    } catch (error) {
      return error;
    }
  }

  static async searchBook(req: Request, res: Response) {
    try {
      const { title } = req.query;

      if (!title) {
        return res
          .status(400)
          .json({ error: "Пожалуйста, укажите поисковый запрос." });
      }
      const book = await Book.find({
        title: { $regex: title, $options: "i" }, // 'i' делает поиск нечувствительным к регистру
      });
      return res.status(200).json({ book });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
