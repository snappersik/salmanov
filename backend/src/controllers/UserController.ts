import { Request, Response } from "express";
import { User } from "../models/atUser/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Role } from "../models/atUser/Role";
import { userSchema } from '../utils/validation';
import { ZodError, ZodIssue } from "zod";

// Расширяем интерфейс Request, чтобы добавить свойство user

export default class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const { name, login, password } = req.body;

      // Валидация данных с помощью Zod
      await userSchema.parseAsync({ name, login, password });

      const userRole = await Role.findOne({ name: "user" });
      if (!userRole) {
        return res.status(500).json({ msg: "Роль 'user' не найдена" });
      }

      // Проверка на существование пользователя с таким логином
      const existingUser = await User.findOne({ login });
      if (existingUser) {
        return res.status(400).json({ msg: "Пользователь с таким логином уже существует" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Создание нового пользователя
      const user = new User({
        name,
        login,
        password: hashedPassword,
        role: userRole._id,
       });

       await user.save();
       return res.status(201).json({ msg:"Пользователь успешно создан"});
   
   } catch (error) {
     if (error instanceof ZodError) {
       console.error("Ошибка валидации:", error.issues);
       return res.status(400).json({
         msg: "Ошибка валидации",
         details: error.issues.map((issue): string => issue.message)
       })
     }
    
     console.error("Ошибка при создании пользователя:", error);
     return res.status(error instanceof Error ?500 :422 ).json(
          error instanceof Error?{msg:"Ошибка при создании пользователя"}:{msg:error}
          );
   }
 }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      return res.status(200).json({ users });
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
      return res
        .status(500)
        .json({ error: "Не удалось получить список пользователей" });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Невалидный ID пользователя" });
      }
      const deleteUser = await User.findByIdAndDelete(id);
      if (!deleteUser) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }
      return res.status(200).json({ msg: "Пользователь успешно удален" });
    } catch (error) {
      return error;
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, login, password } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Невалидный ID пользвателя" });
      }
      const updateUser = await User.findByIdAndUpdate(
        id,
        { name, login, password },
        { new: true, runValidators: true }
      );
      if (!updateUser) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }
      return res.status(200).json({ msg: "Пользователь успешно обновлен" });
    } catch (error) {
      return error;
    }
  }

  static async login(req: Request, res: Response) {
  try {
    const { login, password } = req.body;
    // Проверка логина и пароля
    const finded = await User.findOne({ login });
    if (!finded) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }
    const findedByPass = await bcrypt.compare(password, finded.password);
    if (!findedByPass) {
      return res.status(404).json({ msg: "Неверный пароль" });
    }
    const payLoad = { id: finded._id };
    const secret = process.env.SECRET;
    if (!secret) {
      console.error("Отсутствует переменная окружения SECRET");
      return res.status(500).json({ msg: "Ошибка сервера" });
    }
    const token = jwt.sign(payLoad, secret, { expiresIn: "12h" });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
    });
    return res.status(200).json({ msg: "Вход выполнен успешно", token });
  } catch (error) {
    console.error("Ошибка при входе пользователя:", error);
    return res.status(500).json({ msg: "Ошибка при входе пользователя" });
  }
}


  static async getProfile(req: Request, res: Response) {
    try {
      // Проверяем, что req.user существует и имеет поле id
      if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: "Не авторизован" });
      }

      const profile = await User.findOne({ _id: req.user.id })
        .select("_id name login")
        .exec();

      if (!profile) {
        return res.status(404).json({ msg: "Пользователь не найден" });
      }

      return res.status(200).json({ profile });
    } catch (error) {
      console.error("Ошибка при получении профиля пользователя:", error);
      return res
        .status(500)
        .json({ msg: "Ошибка при получении профиля пользователя" });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("jwt");
      return res.status(200).json({ msg: "Вы успешно вышли из системы" });
    } catch (error) {
      console.error("Ошибка при выходе пользователя:", error);
      return res.status(500).json({ msg: "Ошибка при выходе из системы" });
    }
  }  

  static async addAdmin(req: Request, res: Response) {
    try {
      const { userId } = req.params; // Получаем ID пользователя из параметров запроса
      const { role } = req.body; // Получаем название роли из тела запроса
      if (!userId) {
        return res
          .status(400)
          .json({ msg: "Необходимо указать ID пользователя" });
      }
      if (!role) {
        return res
          .status(400)
          .json({ msg: "Необходимо указать роль для назначения" });
      }
      // 1. Находим пользователя
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "Пользователь не найден" });
      }
      // 2. Находим роль "admin"
      const admin = await Role.findOne({ name: role });
      if (!admin) {
        return res.status(404).json({ msg: "Роль не найдена" });
      }
      // 3. Обновляем роль пользователя
      user.role = admin._id;
      await user.save();
      return res
        .status(200)
        .json({ msg: `Пользователю успешно назначена роль ${admin}` });
    } catch (error) {
      console.error("Ошибка при назначении роли:", error);
      return res.status(500).json({ msg: "Ошибка при назначении роли" });
    }
  }

  
}
