import React from 'react';
import { BorderBeam } from './magicui/border-beam';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/products/${product.id}`}>
            <div className="relative group rounded-xl bg-gray-900 border border-white/10 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                <div className="aspect-square w-full overflow-hidden bg-gray-800">
                    <img 
                        src={product.imageUrl || "https://via.placeholder.com/300"} 
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
                    <p className="text-sm text-gray-400">{product.company}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-xl font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>
                <BorderBeam duration={8} size={100} />
            </div>
        </Link>
    );
};

export default ProductCard;
