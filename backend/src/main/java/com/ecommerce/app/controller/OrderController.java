package com.ecommerce.app.controller;

import com.ecommerce.app.entity.Order;
import com.ecommerce.app.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> orderData) {
        String userEmail = (String) orderData.get("userEmail");
        Double totalAmount = ((Number) orderData.get("totalAmount")).doubleValue();
        Integer itemsCount = ((Number) orderData.get("itemsCount")).intValue();
        
        Order order = orderService.createOrder(userEmail, totalAmount, itemsCount);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String email) {
        List<Order> orders = orderService.getOrdersByUserEmail(email);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
}
