import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, message, type = 'info', onConfirm, showConfirm = false }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        if (type === 'success') return <CheckCircle className="h-12 w-12 text-green-500" />;
        if (type === 'error') return <AlertCircle className="h-12 w-12 text-red-500" />;
        return <AlertCircle className="h-12 w-12 text-blue-500" />;
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]" 
                onClick={onClose}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            ></div>
            
            {/* Modal */}
            <div 
                className="fixed z-[9999] bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                style={{ 
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '28rem',
                    animation: 'modalFadeIn 0.2s ease-out'
                }}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <div className="flex flex-col items-center text-center py-4">
                        {getIcon()}
                        <p className="mt-4 text-gray-300 whitespace-pre-line">{message}</p>
                    </div>

                    <div className="flex gap-3 mt-6">
                        {showConfirm ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
                                >
                                    Confirm
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes modalFadeIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `}</style>
        </>
    );
};

export default Modal;
