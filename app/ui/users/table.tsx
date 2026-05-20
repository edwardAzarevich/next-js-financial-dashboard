import { getUsers } from "@/app/lib/action/user";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { DeleteUser } from "./buttons";

interface UsersTableProps {
  users: Awaited<ReturnType<typeof getUsers>>;
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
      </div>

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            {/* Mobile cards */}
            <div className="md:hidden">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserCircleIcon className="h-8 w-8 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <DeleteUser id={user.id} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    User
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {users?.map((user) => (
                  <tr
                    key={user.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <UserCircleIcon className="h-6 w-6 text-gray-500" />
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <DeleteUser id={user.id} />{" "}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
