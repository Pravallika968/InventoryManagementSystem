package com.pravallika.InventoryMgtSystem.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pravallika.InventoryMgtSystem.dtos.LoginRequest;
import com.pravallika.InventoryMgtSystem.dtos.RegisterRequest;
import com.pravallika.InventoryMgtSystem.dtos.Response;
import com.pravallika.InventoryMgtSystem.dtos.UserDTO;
import com.pravallika.InventoryMgtSystem.enums.UserRole;
import com.pravallika.InventoryMgtSystem.exceptions.InvalidCredentialsException;
import com.pravallika.InventoryMgtSystem.exceptions.NotFoundException;
import com.pravallika.InventoryMgtSystem.models.User;
import com.pravallika.InventoryMgtSystem.repositories.UserRepository;
import com.pravallika.InventoryMgtSystem.security.JwtUtils;
import com.pravallika.InventoryMgtSystem.services.UserService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final JwtUtils jwtUtils;

    @Override
    public Response registerUser(RegisterRequest registerRequest) {
        UserRole role = registerRequest.getRole() != null ? registerRequest.getRole() : UserRole.MANAGER;

        User userToSave = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(role)
                .build();

        userRepository.save(userToSave);

        return Response.builder()
                .status(200)
                .message("User was successfully registered")
                .build();
    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NotFoundException("Email Not Found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Password Does Not Match");
        }

        String token = jwtUtils.generateToken(user.getEmail());

        return Response.builder()
                .status(200)
                .message("User Logged in Successfully")
                .token(token)
                .role(user.getRole())
                .expirationTime("6 months")
                .build();
    }

    @Override
    public Response getAllUsers() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        users.forEach(user -> user.setTransactions(null));

        List<UserDTO> userDTOs = modelMapper.map(users, new TypeToken<List<UserDTO>>() {}.getType());

        return Response.builder()
            .status(200)
            .message("Users fetched successfully")
            .users(userDTOs) // <-- use 'users' field from your Response class
            .build();
   }


    @Override
    public User getCurrentLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User Not Found"));
        user.setTransactions(null);
        return user;
    }

    @Override
    public Response getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User Not Found"));
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.setTransactions(null);
        return Response.builder()
                .status(200)
                .message("success")
                .user(userDTO)
                .build();
    }

    @Override
    public Response updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User Not Found"));

        if (userDTO.getEmail() != null) existingUser.setEmail(userDTO.getEmail());
        if (userDTO.getPhoneNumber() != null) existingUser.setPhoneNumber(userDTO.getPhoneNumber());
        if (userDTO.getName() != null) existingUser.setName(userDTO.getName());
        if (userDTO.getRole() != null) existingUser.setRole(userDTO.getRole());
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty())
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        userRepository.save(existingUser);

        return Response.builder()
                .status(200)
                .message("User successfully updated")
                .build();
    }

    @Override
    public Response deleteUser(Long id) {
        userRepository.findById(id).orElseThrow(() -> new NotFoundException("User Not Found"));
        userRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("User successfully deleted")
                .build();
    }
}