import mongoose, { Schema } from "mongoose";

interface IRole {
  name: string;
}

const roleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
});

export const Role = mongoose.model<IRole>("Role", roleSchema);

// Функция для авто-создания таблицы Роли и проверка на существование роли user и admin.
// Если их нет, то она создаст их сама.
export async function autoCreateRole(): Promise<void> {
  const roles = ["user", "admin"]; // Если нужны еще роли, то нужно добавить их в массив, но не забудьте добавить также в roleSchema в enum.
  for (const roleName of roles) {
    try {
      const checkRole = await Role.findOne({ name: roleName });
      if (!checkRole) {
        const newRole = new Role({ name: roleName });
        await newRole.save();
        console.log(`Роль '${roleName}' создана.`);
      } else {
        console.log(`Роль '${roleName}' уже существует.`);
      }
    } catch (error) {
      console.error(
        `Ошибка при создании или проверке роли '${roleName}':`,
        error
      );
    }
  }
}
