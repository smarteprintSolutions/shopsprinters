'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-dark mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-8">{error.message}</p>
        <button
          onClick={() => reset()}
          className="inline-block bg-[#024AD8] text-white px-8 py-3 rounded-2xl hover:bg-[#01369e] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
