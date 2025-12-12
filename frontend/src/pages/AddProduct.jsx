import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const AddProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                const response = await api.get(`/products/${id}`);
                setFormData(response.data);
            };
            fetchProduct();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/products/${id}`, formData);
            } else {
                await api.post('/products', formData);
            }
            navigate('/');
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Update Product' : 'Add New Product'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-8 rounded-xl border border-white/10">
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
                <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" rows="4" />
                <div className="flex gap-4">
                    <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
                    <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
                </div>
                <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
                <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg font-bold text-white mt-4 hover:opacity-90 transition-opacity">
                    {isEdit ? 'Update Product' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
