// app/loading.tsx (Next.js App Router auto-loader)
export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

        {/* App Name */}
        <p className="text-sm font-medium text-muted-foreground">
          Loading <span className="font-semibold text-primary">Taskora</span>...
        </p>
      </div>
    </div>
  );
}
