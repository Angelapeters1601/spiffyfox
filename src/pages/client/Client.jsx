const Client = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="text-center">
        <h1 className="mb-6 text-7xl font-black text-gray-900 md:text-9xl">
          CLIENT
        </h1>
        <p className="mb-4 text-3xl font-bold text-purple-600 md:text-5xl">
          Welcome to SpiffyFox
        </p>
        <p className="mb-8 text-xl text-gray-600 md:text-2xl">
          Client Dashboard - Coming Soon
        </p>
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white/50 p-6 backdrop-blur-sm">
          <p className="text-lg text-gray-700">
            This is a simple client page for testing navigation. Full dashboard
            with username will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Client;
