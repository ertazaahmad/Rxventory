import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      {/* Big error code */}
      <h1 className="text-6xl font-extrabold text-blue-600 mb-4">
        404
      </h1>

      {/* Message */}
      <p className="text-xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </p>

      <p className="text-sm text-gray-600 max-w-md mb-6">
        The page you are trying to access does not exist or may have been moved.
      </p>

      {/* Action */}
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
