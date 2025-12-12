import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', showConfirm: false });
    const { user } = useAuth();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            setCartItems(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const updateQuantity = async (id, quantity) => {
        if (quantity < 1) return;
        try {
            await api.put(`/cart/${id}`, { quantity });
            fetchCart();
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const removeItem = async (id) => {
        try {
            await api.delete(`/cart/${id}`);
            fetchCart();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            setModal({
                isOpen: true,
                title: 'Cart Empty',
                message: 'Your cart is empty!',
                type: 'error',
                showConfirm: false
            });
            return;
        }

        const total = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
        setModal({
            isOpen: true,
            title: 'Confirm Checkout',
            message: `Total Amount: ₹${total.toLocaleString('en-IN')}\n\nThis will place your order and clear your cart.`,
            type: 'info',
            showConfirm: true,
            onConfirm: processCheckout
        });
    };

    const processCheckout = async () => {
        const total = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
        const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        
        try {
            // Create order
            await api.post('/orders/create', {
                userEmail: user?.email || 'guest@example.com',
                totalAmount: total,
                itemsCount: itemsCount
            });
            
            // Clear all cart items
            for (const item of cartItems) {
                await api.delete(`/cart/${item.id}`);
            }
            
            setModal({
                isOpen: true,
                title: 'Order Placed! 🎉',
                message: `Total: ₹${total.toLocaleString('en-IN')}\n\nThank you for shopping with us!`,
                type: 'success',
                showConfirm: false
            });
            
            fetchCart(); // Refresh to show empty cart
        } catch (error) {
            console.error("Error during checkout:", error);
            setModal({
                isOpen: true,
                title: 'Checkout Failed',
                message: 'Checkout failed. Please try again.',
                type: 'error',
                showConfirm: false
            });
        }
    };

    const total = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                {cartItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-gray-700 rounded-lg overflow-hidden">
                                {item.product ? (
                                    <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-gray-500" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold">{item.product ? item.product.name : 'Unknown Product'}</h3>
                                <p className="text-sm text-gray-400">Unit: ₹{item.product?.price.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 bg-black/30 rounded-lg p-1">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-white/10 rounded">-</button>
                                <span className="w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-white/10 rounded">+</button>
                            </div>
                            <div className="font-bold w-20 text-right">₹{item.totalPrice.toLocaleString('en-IN')}</div>
                            <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
                {cartItems.length === 0 && (
                    <div className="p-10 text-center text-gray-400">Your cart is empty</div>
                )}
            </div>
            
            {cartItems.length > 0 && (
                <div className="mt-8 flex justify-end">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 w-full max-w-sm">
                        <div className="flex justify-between text-xl font-bold mb-4">
                            <span>Total:</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                showConfirm={modal.showConfirm}
                onConfirm={modal.onConfirm}
            />
        </div>
    );
};

export default Cart;
