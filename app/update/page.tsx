"use client";

export default function Update() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">
        This is not a valid update route
      </h1>

      <p className="text-gray-600 max-w-md">
        The page <span className="font-semibold text-red-600">/update</span> is not accessible directly.
        <br />
        To update your avatar, please use the correct URL format:
      </p>

      <div className="mt-4 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2">
        <code className="text-sm font-mono text-blue-600">
          /update/{`{username}`}
        </code>
      </div>

      <p className="text-gray-500 text-sm mt-4 max-w-sm">
        Replace <span className="text-blue-600 font-semibold">{`{username}`}</span> with your actual avatar username to get access.
      </p>
    </div>
  );
}
