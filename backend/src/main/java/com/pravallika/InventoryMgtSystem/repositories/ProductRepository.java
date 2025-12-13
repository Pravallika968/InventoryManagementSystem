package com.pravallika.InventoryMgtSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pravallika.InventoryMgtSystem.models.Product;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingOrDescriptionContaining(String name, String description);

    List<Product> findByIsDeletedFalse(); 

    // Add this method to fetch products by category
}
