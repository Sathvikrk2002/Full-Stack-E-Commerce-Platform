import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Package, Calendar, ShoppingBag, Shield } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAdmin } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        if (!user?.email) return;
        
        setLoading(true);
        try {
            let response;
            if (isAdmin()) {
                // Admin sees all orders
                response = await api.get('/orders/all');
            } else {
                // Regular user sees only their orders
                response = await api.get(`/orders/user/${encodeURIComponent(user.email)}`);
            }
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return 'bg-green-500/20 text-green-400';
            case 'Processing': return 'bg-yellow-500/20 text-yellow-400';
            case 'Shipped': return 'bg-blue-500/20 text-blue-400';
            case 'Delivered': return 'bg-purple-500/20 text-purple-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Loading orders...</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">Order History</h1>
                    {isAdmin() && (
                        <span className="px-3 py-1 bg-purple-600 rounded-full text-sm flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Admin View - All Orders
                        </span>
                    )}
                </div>
                <p className="text-gray-400">
                    {isAdmin() ? 'View all customer orders' : 'View all your past orders'}
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                    <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-400">No orders yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {isAdmin() ? 'No orders have been placed yet' : 'Start shopping to see your orders here'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div 
                            key={order.id} 
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-600 p-3 rounded-lg">
                                        <ShoppingBag className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                        <p className="text-sm text-gray-400 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(order.orderDate)}
                                        </p>
                                    </div>
                                </div>
                                
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Items</p>
                                    <p className="font-semibold">{order.itemsCount} item{order.itemsCount > 1 ? 's' : ''}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                                    <p className="font-bold text-green-400">
                                        ₹{order.totalAmount.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Customer Email</p>
                                    <p className="font-semibold text-sm truncate">{order.userEmail}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
