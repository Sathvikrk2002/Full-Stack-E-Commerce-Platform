package com.ecommerce.app.service;

import com.ecommerce.app.entity.Product;
import java.util.List;

public interface ProductService {
    Product saveProduct(Product product);
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    List<Product> getProductsByCategory(String category);
    List<Product> searchProducts(String keyword);
    List<String> getAllCategories();
}
