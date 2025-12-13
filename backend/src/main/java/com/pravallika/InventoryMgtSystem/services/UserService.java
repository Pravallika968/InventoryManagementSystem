package com.pravallika.InventoryMgtSystem.services;

import com.pravallika.InventoryMgtSystem.dtos.LoginRequest;
import com.pravallika.InventoryMgtSystem.dtos.RegisterRequest;
import com.pravallika.InventoryMgtSystem.dtos.Response;
import com.pravallika.InventoryMgtSystem.dtos.UserDTO;
import com.pravallika.InventoryMgtSystem.models.User;

public interface UserService {
    Response registerUser(RegisterRequest registerRequest);

    Response loginUser(LoginRequest loginRequest);

    Response getAllUsers();

    User getCurrentLoggedInUser();

    Response getUserById(Long id);

    Response updateUser(Long id, UserDTO userDTO);

    Response deleteUser(Long id);

    Response getUserTransactions(Long id);
}
