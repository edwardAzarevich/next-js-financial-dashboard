"use client";

import { deleteUser } from "@/app/lib/action/user";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTransition } from "react";

export function DeleteUser({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this user?")) {
      startTransition(() => {
        deleteUser(id);
      });
    }
  };
  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}
