package com.ecommerce.app.service;

import com.ecommerce.app.entity.Cart;


import java.util.List;

public interface CartService {
    Cart addToCart(Long productId, int quantity);
    Cart updateCartItem(Long cartId, int quantity);
    void removeCartItem(Long cartId);
    List<Cart> getCartItems();
}
