import { getUsers } from "@/app/lib/action/user";
import { CustomersTableSkeleton } from "@/app/ui/skeleton/skeleton";
import UsersTable from "@/app/ui/users/table";
import { Suspense } from "react";

export default async function Page() {
  const users = await getUsers();

  if (!users || users.length === 0) {
    return (
      <div className="w-full">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <p className="mt-6 text-center text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<CustomersTableSkeleton />}>
      <UsersTable users={users} />
    </Suspense>
  );
}
