import { getCustomers } from "@/app/lib/action/customerAction";
import CustomersTable from "@/app/ui/customers/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page() {
  const customers = await getCustomers();
  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}
