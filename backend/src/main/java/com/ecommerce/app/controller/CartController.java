package com.ecommerce.app.controller;

import com.ecommerce.app.entity.Cart;
import com.ecommerce.app.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public List<Cart> getCartItems() {
        return cartService.getCartItems();
    }

    @PostMapping("/add")
    public Cart addToCart(@RequestBody Map<String, Object> payload) {
        // Simple payload handling: { "productId": 1, "quantity": 1 }
        Long productId = Long.valueOf(payload.get("productId").toString());
        int quantity = Integer.parseInt(payload.get("quantity").toString());
        return cartService.addToCart(productId, quantity);
    }

    @PutMapping("/{id}")
    public Cart updateCartItem(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        int quantity = payload.get("quantity");
        return cartService.updateCartItem(id, quantity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long id) {
        cartService.removeCartItem(id);
        return ResponseEntity.ok().build(); // Return 200 OK
    }
}
