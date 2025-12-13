package com.pravallika.InventoryMgtSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pravallika.InventoryMgtSystem.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
