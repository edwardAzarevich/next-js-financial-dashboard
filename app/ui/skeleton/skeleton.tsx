export function CustomersTableSkeleton() {
  return (
    <div className="mt-4">
      <div className="mb-4 h-10 w-64 animate-pulse rounded-md bg-gray-200" />

      <div className="mb-2 h-12 animate-pulse rounded-lg bg-gray-100" />

      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-50" />
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200" />
        <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200" />
      </div>
    </div>
  );
}
