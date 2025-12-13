package com.pravallika.InventoryMgtSystem.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pravallika.InventoryMgtSystem.dtos.LoginRequest;
import com.pravallika.InventoryMgtSystem.dtos.RegisterRequest;
import com.pravallika.InventoryMgtSystem.dtos.Response;
import com.pravallika.InventoryMgtSystem.services.UserService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    // Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<Response> registerUser(@RequestBody @Valid RegisterRequest registerRequest) {
        Response response = userService.registerUser(registerRequest);
        return ResponseEntity.ok(response);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<Response> loginUser(@RequestBody @Valid LoginRequest loginRequest) {
        Response response = userService.loginUser(loginRequest);
        return ResponseEntity.ok(response);
    }
}
