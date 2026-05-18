import { revalidatePath } from "next/cache";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getUsers() {
  try {
    const users = await sql`
      SELECT id, name, email
      FROM users
      ORDER BY name ASC
      `;
    return users;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function deleteUser(id: string) {
  await sql`DELETE FROM users WHERE id = ${id}`;
  revalidatePath("/dashboard/users");
}
