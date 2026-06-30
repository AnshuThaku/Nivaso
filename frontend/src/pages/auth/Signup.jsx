import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "Guest",
        password: "",
        confirmPassword: "",
        agreedToTerms: false
    });

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ text: "", color: "text-gray-400" });

    const API_URL = import.meta.env.VITE_API_URL;
    const { login } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    // Password strength evaluator
    const evaluatePassword = (pass) => {
        if (!pass) return { text: "", color: "text-gray-400" };
        
        let score = 0;
        if (pass.length >= 6) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 2) return { text: "Weak", color: "text-red-500" };
        if (score <= 4) return { text: "Good", color: "text-yellow-600" };
        return { text: "Strong", color: "text-green-600" };
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData({ ...formData, [name]: newValue });

        if (name === 'password') {
            setPasswordStrength(evaluatePassword(value));
        }
    };

    const handleGoogleSignup = (e) => {
        e.preventDefault();
        showNotification("Google signup is coming soon!", "info");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return showNotification("Passwords do not match!", "error");
        }
        if (!formData.agreedToTerms) {
            return showNotification("Please agree to the Terms & Conditions.", "error");
        }

        try {
            const response = await axios.post(`${API_URL}/signup`, {
                username: formData.fullName, 
                email: formData.email,
                phone: formData.phoneNumber,
                role: formData.role,
                password: formData.password
            });
            
            if (response.data.token) {
                 login(response.data);
                 showNotification("Welcome to Nivaso!", "success");
                 navigate("/listings");
            } else {
                 const loginResponse = await axios.post(`${API_URL}/login`, {
                     email: formData.email,
                     password: formData.password
                 });
                 
                 login(loginResponse.data);
                 showNotification("Account created successfully! Welcome.", "success");
                 navigate("/listings");
            }
        } catch (error) {
            console.error(error);
            showNotification(error.response?.data?.message || error.response?.data?.error || "Signup failed", "error");
        }
    };

    const EyeIcon = ({ visible }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
            {visible ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            )}
        </svg>
    );

    return (
        /* ✅ FIX: Added pt-20 to push the whole page down below your fixed/sticky Navbar */
        <div className="flex min-h-screen pt-20 bg-white">
            
            {/* Left Side: Brand Panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 p-12 flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10 pointer-events-none"></div>
                <div className="relative z-10">
                    <span className="text-2xl font-black tracking-wider">NIVASO</span>
                </div>
                <div className="relative z-10 space-y-4">
                    <h1 className="text-4xl font-extrabold leading-tight">Find your next perfect stay or host amazing guests.</h1>
                    <p className="text-rose-100 text-lg">Join our community of hosts and travelers worldwide. Seamless multi-tenant management built for modern needs.</p>
                </div>
                <div className="relative z-10 text-sm text-rose-200">
                    &copy; {new Date().getFullYear()} Nivaso Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side: Signup Form Panel */}
            {/* ✅ FIX: Adjusted vertical paddings (py-8 md:py-12) to keep a uniform clean gap from top & bottom */}
            <div className="w-full lg:w-7/12 flex flex-col justify-center px-4 py-8 sm:px-12 md:px-20 lg:px-24 bg-gray-50/50 overflow-y-auto">
                <div className="w-full max-w-2xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-2xl md:shadow-sm md:border md:border-gray-100">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Join Nivaso today. It only takes a few minutes.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Two Column Grid for Full Name and Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 sm:text-sm transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 sm:text-sm transition-colors"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 sm:text-sm transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Join As Radio Buttons */}
                        <div>
                            <span className="block text-sm font-medium text-gray-700 mb-2">Join As</span>
                            <div className="flex gap-6">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Guest"
                                        checked={formData.role === "Guest"}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                                    />
                                    <span className="ml-2.5 text-sm font-medium text-gray-700 group-hover:text-gray-900">Guest (Looking for stay)</span>
                                </label>
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Host"
                                        checked={formData.role === "Host"}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                                    />
                                    <span className="ml-2.5 text-sm font-medium text-gray-700 group-hover:text-gray-900">Host (List your space)</span>
                                </label>
                            </div>
                        </div>

                        {/* Two Column Grid for Password Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 sm:text-sm transition-colors"
                                        placeholder="Create password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <EyeIcon visible={showPassword} />
                                    </button>
                                </div>
                                
                                {/* Elegant Text-Based Password Strength */}
                                {formData.password && (
                                    <p className={`text-xs mt-1.5 font-semibold flex items-center gap-1 ${passwordStrength.color}`}>
                                        <span className="text-base leading-none">•</span> {passwordStrength.text} Password
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 sm:text-sm transition-colors"
                                        placeholder="Confirm password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <EyeIcon visible={showConfirmPassword} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="agreedToTerms"
                                    name="agreedToTerms"
                                    type="checkbox"
                                    required
                                    checked={formData.agreedToTerms}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
                                />
                            </div>
                            <div className="ml-2.5 text-sm">
                                <label htmlFor="agreedToTerms" className="text-gray-600 cursor-pointer select-none">
                                    I agree to the <a href="#" className="font-semibold text-rose-600 hover:underline">Terms & Conditions</a> and Privacy Policy.
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 pt-2">
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-rose-600 py-3 px-4 text-sm font-semibold text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors shadow-sm"
                            >
                                Create Account
                            </button>
                            
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink mx-4 text-gray-400 text-xs tracking-wide uppercase">Or register with</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors shadow-sm"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Sign up with Google
                            </button>
                        </div>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-rose-600 hover:underline transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;