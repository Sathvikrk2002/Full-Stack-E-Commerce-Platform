package com.ecommerce.app.repository;

import com.ecommerce.app.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByProduct_Id(Long productId);
    
    @Transactional
    void deleteByProduct_Id(Long productId);
}
