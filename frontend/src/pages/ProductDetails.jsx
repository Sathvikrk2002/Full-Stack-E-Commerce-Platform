import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BorderBeam } from '../components/magicui/border-beam';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        if (!isAuthenticated()) {
            setModal({
                isOpen: true,
                title: 'Sign In Required',
                message: 'Please sign in to add items to your cart.',
                type: 'info',
                showConfirm: false,
                onConfirm: () => {
                    setModal({ ...modal, isOpen: false });
                    navigate('/signin', { state: { from: location } });
                }
            });
            return;
        }

        if (product.stock === 0) {
            setModal({
                isOpen: true,
                title: 'Out of Stock',
                message: 'This product is currently out of stock.',
                type: 'error',
                showConfirm: false
            });
            return;
        }

        try {
            await api.post('/cart/add', {
                productId: product.id,
                quantity: 1
            });
            setModal({
                isOpen: true,
                title: 'Success!',
                message: 'Product added to cart successfully!',
                type: 'success',
                showConfirm: false
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            setModal({
                isOpen: true,
                title: 'Error',
                message: 'Failed to add product to cart. Please try again.',
                type: 'error',
                showConfirm: false
            });
        }
    };

    const handleDelete = () => {
        setModal({
            isOpen: true,
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this product?',
            type: 'error',
            showConfirm: true,
            onConfirm: confirmDelete
        });
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/products/${id}`);
            setModal({ ...modal, isOpen: false });
            navigate('/');
        } catch (error) {
            console.error("Error deleting product:", error);
            setModal({
                isOpen: true,
                title: 'Delete Failed',
                message: 'Failed to delete product. Please try again.',
                type: 'error',
                showConfirm: false
            });
        }
    };

    if (!product) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto p-6 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 relative rounded-xl overflow-hidden border border-white/10">
                <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover" />
                <BorderBeam size={200} duration={10} />
            </div>
            <div className="md:w-1/2 flex flex-col space-y-4">
                <h1 className="text-4xl font-bold">{product.name}</h1>
                <p className="text-gray-400 text-lg">{product.company} - {product.category}</p>
                <div className="text-3xl font-bold text-green-400">₹{product.price.toLocaleString('en-IN')}</div>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
                <p className={`font-semibold ${product.stock > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                </p>
                
                <div className="flex gap-4 mt-6">
                    <button 
                        onClick={addToCart} 
                        disabled={product.stock === 0}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${
                            product.stock === 0 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
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
        </div>
    );
};

export default ProductDetails;
