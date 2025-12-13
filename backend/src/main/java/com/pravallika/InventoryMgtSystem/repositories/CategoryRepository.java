package com.pravallika.InventoryMgtSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pravallika.InventoryMgtSystem.models.Category;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
     List<Category> findByIsDeletedFalse();
}
