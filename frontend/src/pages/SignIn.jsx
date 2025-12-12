import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail } from 'lucide-react';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const result = await login(email.trim(), password);
        
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
                        <User className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome to E-Shop</h1>
                    <p className="text-gray-400">Please sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                required
                            />
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                required
                            />
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have account?{' '}
                    <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
