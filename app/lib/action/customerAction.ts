import postgres from "postgres";
import { FormattedCustomersTable } from "../definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getCustomers() {
  try {
    const customers: FormattedCustomersTable[] = await sql`
      SELECT
        c.id,
        c.name,
        c.email,
        c.image_url,
        COUNT(i.id)::int AS total_invoices,
        COALESCE(SUM(i.amount) FILTER (WHERE i.status = 'pending'), 0) AS total_pending,
        COALESCE(SUM(i.amount) FILTER (WHERE i.status = 'paid'), 0) AS total_paid
      FROM customers c
      LEFT JOIN invoices i ON c.id = i.customer_id
      GROUP BY c.id, c.name, c.email, c.image_url
      ORDER BY c.name
    `;
    return customers;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}
