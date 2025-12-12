import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronDown, Search, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import api from '../api/axios';

const Navbar = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', showConfirm: false });
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, logout, user } = useAuth();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/products/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleLogoutClick = () => {
        setModal({
            isOpen: true,
            title: 'Confirm Logout',
            message: 'Are you sure you want to logout?',
            type: 'info',
            showConfirm: true,
            onConfirm: confirmLogout
        });
    };

    const confirmLogout = () => {
        logout();
        setModal({ isOpen: false, title: '', message: '', type: 'info', showConfirm: false });
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    E-Shop
                </Link>
                
                {/* Category Dropdown */}
                <div className="relative">
                    <button 
                        onMouseEnter={() => setShowCategories(true)}
                        onMouseLeave={() => setShowCategories(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:text-purple-400 transition-colors"
                    >
                        Categories
                        <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {showCategories && categories.length > 0 && (
                        <div 
                            onMouseEnter={() => setShowCategories(true)}
                            onMouseLeave={() => setShowCategories(false)}
                            className="absolute top-full left-0 mt-0 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
                        >
                            {categories.map((category, index) => (
                                <Link 
                                    key={category}
                                    to={`/category/${category}`} 
                                    className={`block px-4 py-3 hover:bg-white/10 transition-colors ${
                                        index < categories.length - 1 ? 'border-b border-white/5' : ''
                                    }`}
                                    onClick={() => setShowCategories(false)}
                                >
                                    {category}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..." 
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                </form>

                <div className="flex items-center gap-6">
                    <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
                    
                    {/* Admin-only links */}
                    {isAuthenticated() && isAdmin() && (
                        <>
                            <Link to="/products/add" className="hover:text-purple-400 transition-colors">Add Product</Link>
                            <Link to="/modify" className="hover:text-purple-400 transition-colors">Modify</Link>
                        </>
                    )}
                    
                    {/* Cart - available for all authenticated users */}
                    {isAuthenticated() && (
                        <>
                            <Link to="/cart" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Cart
                            </Link>
                            <Link to="/orders" className="hover:text-purple-400 transition-colors">
                                Orders
                            </Link>
                        </>
                    )}
                    
                    {isAuthenticated() ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">
                                Hi, {user?.email?.split('@')[0]}
                                {isAdmin() && <span className="ml-2 px-2 py-0.5 bg-purple-600 rounded text-xs">Admin</span>}
                            </span>
                            <button 
                                onClick={handleLogoutClick}
                                className="hover:text-red-400 transition-colors flex items-center gap-2"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link 
                            to="/signin"
                            className="hover:text-purple-400 transition-colors flex items-center gap-2"
                        >
                            <LogIn className="h-5 w-5" />
                            Sign In
                        </Link>
                    )}
                </div>
            </div>

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                showConfirm={modal.showConfirm}
                onConfirm={modal.onConfirm}
            />
        </nav>
    );
};

export default Navbar;
