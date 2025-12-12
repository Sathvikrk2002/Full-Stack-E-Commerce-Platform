import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

const ModifyProducts = () => {
    const [products, setProducts] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', showConfirm: false });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleDelete = (id, name) => {
        setModal({
            isOpen: true,
            title: 'Confirm Delete',
            message: `Are you sure you want to delete "${name}"?`,
            type: 'error',
            showConfirm: true,
            onConfirm: () => confirmDelete(id, name)
        });
    };

    const confirmDelete = async (id, name) => {
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
            setModal({
                isOpen: true,
                title: 'Product Deleted',
                message: `"${name}" has been deleted successfully.`,
                type: 'success',
                showConfirm: false
            });
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

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Modify Products</h1>
            
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/10">
                        <tr>
                            <th className="text-left p-4">Image</th>
                            <th className="text-left p-4">Name</th>
                            <th className="text-left p-4">Company</th>
                            <th className="text-left p-4">Price</th>
                            <th className="text-left p-4">Stock</th>
                            <th className="text-left p-4">Category</th>
                            <th className="text-center p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <img 
                                        src={product.imageUrl || "https://via.placeholder.com/100"} 
                                        alt={product.name}
                                        className="h-16 w-16 object-cover rounded-lg"
                                    />
                                </td>
                                <td className="p-4 font-semibold">{product.name}</td>
                                <td className="p-4 text-gray-400">{product.company}</td>
                                <td className="p-4 font-bold text-green-400">₹{product.price.toLocaleString('en-IN')}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400">{product.category}</td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => navigate(`/products/edit/${product.id}`)}
                                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                            title="Update"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {products.length === 0 && (
                    <div className="p-10 text-center text-gray-400">No products found</div>
                )}
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

export default ModifyProducts;
