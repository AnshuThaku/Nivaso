import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl font-bold text-gray-200">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
            <p className="text-gray-500 mt-2 max-w-md">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <Link to="/" className="mt-8 px-6 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition">
                Go Home
            </Link>
        </div>
    )
}

export default NotFound;
