package com.pravallika.InventoryMgtSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pravallika.InventoryMgtSystem.models.Supplier;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
     List<Supplier> findByIsDeletedFalse();
}
