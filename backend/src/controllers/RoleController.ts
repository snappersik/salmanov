import { Request, Response } from "express";
import { Role } from "../models/atUser/Role";
import mongoose from "mongoose";

export default class RoleController {
  static async createRole(req: Request, res: Response) {
    try {
      if (!req.body.name || typeof req.body.name !== "string") {
        throw new Error("Имя роли должно быть строкой");
      }
      const role = new Role({
        name: req.body.name,
      });
      await role.save();
      return res.status(201).json({ msg: "Роль успешно добавлена" });
    } catch (error) {
      console.error("Ошибка при создании роли:", error);
      return res.status(400).json({ error });
    }
  }

  static async getRoles(req: Request, res: Response) {
    try {
      const roles = await Role.find();
      return res.status(200).json({ roles });
    } catch (error) {
      console.error("Ошибка при получении ролей:", error);
      return res
        .status(500)
        .json({ error: "Не удалось получить список ролей" });
    }
  }
  static async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Невалидный ID роли" });
      }
      const deleteRole = await Role.findByIdAndDelete(id);
      if (!deleteRole) {
        return res.status(404).json({ error: "Роль не найдена" });
      }
      return res.status(200).json({ msg: "Роль успешно удалена" });
    } catch (error) {
      return error;
    }
  }
}
