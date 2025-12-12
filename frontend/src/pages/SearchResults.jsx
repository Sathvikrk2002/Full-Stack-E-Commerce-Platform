import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            searchProducts();
        }
    }, [query]);

    const searchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/products/search?keyword=${encodeURIComponent(query)}`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error searching products:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Searching...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-gray-400 mb-8">Found {products.length} results for "{query}"</p>
            
            {products.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                    <p className="text-xl">No products found matching "{query}"</p>
                    <p className="mt-2">Try different keywords</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
