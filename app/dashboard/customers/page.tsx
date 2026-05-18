import { getCustomers } from "@/app/lib/action/customer";
import CustomersTable from "@/app/ui/customers/table";
import { CustomersTableSkeleton } from "@/app/ui/skeleton/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page() {
  const customers = await getCustomers();
  return (
    <main>
      <Suspense fallback={<CustomersTableSkeleton />}>
        <CustomersTable customers={customers} />
      </Suspense>
    </main>
  );
}
