"use server";

import postgres from "postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) {
        return undefined;
      }
      return Number(val);
    },
    z
      .number({
        required_error: "Please enter an amount.",
        invalid_type_error: "Please enter a valid amount.",
      })
      .gt(0, { message: "Please enter an amount greater than $0." }),
  ),
  status: z.enum(["pending", "paid"], {
    required_error: "Please select an invoice status.",
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
  inputs?: {
    customerId?: string;
    amount?: string;
    status?: string;
  };
};

export async function createInvoice(prevState: State, formData: FormData) {
  const customerId = formData.get("customerId") as string;
  const amount = formData.get("amount") as string;
  const status = formData.get("status") as string;

  const validatedFields = CreateInvoice.safeParse({
    customerId,
    amount: amount === "" ? undefined : amount,
    status,
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
      inputs: {
        customerId: customerId || "",
        amount: amount || "",
        status: status || "",
      },
    };
  }

  // Prepare data for insertion into the database

  const amountInCents = validatedFields.data!.amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const customerId = formData.get("customerId") as string;
  const amount = formData.get("amount") as string;
  const status = formData.get("status") as string;

  const validatedFields = UpdateInvoice.safeParse({
    customerId,
    amount: amount === "" ? undefined : amount,
    status,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
      inputs: {
        customerId: customerId || "",
        amount: amount || "",
        status: status || "",
      },
    };
  }

  const {
    customerId: validCustomerId,
    amount: validAmount,
    status: validStatus,
  } = validatedFields.data;
  const amountInCents = validAmount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${validCustomerId}, amount = ${amountInCents}, status = ${validStatus}
        WHERE id = ${id}
      `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Invoice.",
      inputs: { customerId, amount, status },
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
