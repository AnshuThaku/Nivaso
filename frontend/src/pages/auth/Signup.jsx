import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    
    const { login } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Send the signup request
            const response = await axios.post("http://localhost:8080/signup", formData);
            
            // 2. Check if the backend gave us a token right away
            if (response.data.token) {
                 login(response.data);
                 showNotification("Welcome to Nivaso!", "success");
                 navigate("/listings");
            } else {
                 // 3. If no token was provided, automatically log them in in the background
                 const loginResponse = await axios.post("http://localhost:8080/login", {
                     email: formData.email,
                     password: formData.password
                 });
                 
                 // 4. Save the user data/token and redirect directly to listings
                 login(loginResponse.data);
                 showNotification("Account created successfully! Welcome.", "success");
                 navigate("/listings");
            }

        } catch (error) {
            console.error(error);
            showNotification(error.response?.data?.error || "Signup failed", "error");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        Join Nivaso
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create an account to start exploring.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm transition-colors"
                                placeholder="Choose a username"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm transition-colors"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm transition-colors"
                                placeholder="Create a password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg border border-transparent bg-rose-600 py-3 px-4 text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already a member?{" "}
                        <Link to="/login" className="font-semibold text-rose-600 hover:text-rose-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;