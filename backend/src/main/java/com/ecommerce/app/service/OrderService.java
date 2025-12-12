package com.ecommerce.app.service;

import com.ecommerce.app.entity.Order;
import com.ecommerce.app.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    public Order createOrder(String userEmail, Double totalAmount, Integer itemsCount) {
        Order order = new Order();
        order.setUserEmail(userEmail);
        order.setTotalAmount(totalAmount);
        order.setItemsCount(itemsCount);
        order.setStatus("Completed");
        return orderRepository.save(order);
    }
    
    public List<Order> getOrdersByUserEmail(String userEmail) {
        return orderRepository.findByUserEmailOrderByOrderDateDesc(userEmail);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
