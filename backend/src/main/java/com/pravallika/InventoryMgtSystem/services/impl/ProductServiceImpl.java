package com.pravallika.InventoryMgtSystem.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pravallika.InventoryMgtSystem.dtos.ProductDTO;
import com.pravallika.InventoryMgtSystem.dtos.Response;
import com.pravallika.InventoryMgtSystem.models.Product;
import com.pravallika.InventoryMgtSystem.repositories.ProductRepository;
import com.pravallika.InventoryMgtSystem.services.ProductService;

import java.io.File;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Save images in backend
    private static final String IMAGE_DIRECTORY = new File("backend/product-images").getAbsolutePath();
    private static final String IMAGE_BASE_URL = "http://localhost:5050/images/";

    // ------------------- SAVE PRODUCT -------------------
    @Override
    public Response saveProduct(ProductDTO productDTO, MultipartFile imageFile) {
        try {
            Product product = new Product();
            product.setName(productDTO.getName());
            product.setSku(productDTO.getSku());
            product.setPrice(productDTO.getPrice() != null ? productDTO.getPrice() : BigDecimal.ZERO);
            product.setStockQuantity(productDTO.getStockQuantity() != null ? productDTO.getStockQuantity() : 0);
            product.setDescription(productDTO.getDescription());

            if (imageFile != null && !imageFile.isEmpty()) {
                product.setImageUrl(saveImage(imageFile));
            }

            Product savedProduct = productRepository.save(product);
            return Response.builder()
                    .status(200)
                    .message("Product saved successfully")
                    .product(toDTO(savedProduct))
                    .build();

        } catch (Exception e) {
            return Response.builder()
                    .status(500)
                    .message("Error saving product: " + e.getMessage())
                    .build();
        }
    }

    // ------------------- UPDATE PRODUCT -------------------
    @Override
    public Response updateProduct(ProductDTO productDTO, MultipartFile imageFile) {
        Optional<Product> productOpt = productRepository.findById(productDTO.getProductId());
        if (productOpt.isEmpty()) {
            return Response.builder()
                    .status(404)
                    .message("Product not found")
                    .build();
        }

        Product product = productOpt.get();
        if (productDTO.getName() != null) product.setName(productDTO.getName());
        if (productDTO.getSku() != null) product.setSku(productDTO.getSku());
        if (productDTO.getPrice() != null) product.setPrice(productDTO.getPrice());
        if (productDTO.getStockQuantity() != null) product.setStockQuantity(productDTO.getStockQuantity());
        if (productDTO.getDescription() != null) product.setDescription(productDTO.getDescription());

        // Handle image update
        if (imageFile != null && !imageFile.isEmpty()) {
            deleteImageFile(product.getImageUrl());  // delete old image
            product.setImageUrl(saveImage(imageFile)); // save new image
        }

        Product updated = productRepository.save(product);
        return Response.builder()
                .status(200)
                .message("Product updated successfully")
                .product(toDTO(updated))
                .build();
    }

    // ------------------- DELETE PRODUCT -------------------
    @Override
    public Response deleteProduct(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            return Response.builder()
                    .status(404)
                    .message("Product not found")
                    .build();
        }

        Product product = productOpt.get();
        product.setIsDeleted(true); // soft delete

        // Delete image file
        deleteImageFile(product.getImageUrl());
        product.setImageUrl(null);

        productRepository.save(product);
        return Response.builder()
                .status(200)
                .message("Product deleted successfully")
                .build();
    }

    // ------------------- GET ALL PRODUCTS -------------------
    @Override
    public Response getAllProducts() {
        List<ProductDTO> productDTOs = productRepository.findByIsDeletedFalse()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Products fetched successfully")
                .products(productDTOs)
                .build();
    }

    // ------------------- GET PRODUCT BY ID -------------------
    @Override
    public Response getProductById(Long id) {
        return productRepository.findById(id)
                .map(product -> Response.builder()
                        .status(200)
                        .message("Product fetched successfully")
                        .product(toDTO(product))
                        .build())
                .orElse(Response.builder()
                        .status(404)
                        .message("Product not found")
                        .build());
    }

    // ------------------- SEARCH PRODUCTS -------------------
    @Override
    public Response searchProduct(String input) {
        List<ProductDTO> productDTOs = productRepository
                .findByNameContainingOrDescriptionContaining(input, input)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Search results")
                .products(productDTOs)
                .build();
    }
    @Override
public Response reduceStock(Long productId, Integer quantity) {
    Optional<Product> productOpt = productRepository.findById(productId);
    if (productOpt.isEmpty()) {
        return Response.builder()
                .status(404)
                .message("Product not found")
                .build();
    }

    Product product = productOpt.get();

    if (product.getStockQuantity() < quantity) {
        return Response.builder()
                .status(400)
                .message("Insufficient stock")
                .build();
    }

    product.setStockQuantity(product.getStockQuantity() - quantity);
    productRepository.save(product);

    return Response.builder()
            .status(200)
            .message("Stock updated successfully")
            .product(toDTO(product))
            .build();
    }
    @Override
    public List<ProductDTO> getAllProductsDTO() {
    return productRepository.findByIsDeletedFalse()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }



    
    // ------------------- HELPER METHODS -------------------
    private String saveImage(MultipartFile imageFile) {
        try {
            File dir = new File(IMAGE_DIRECTORY);
            if (!dir.exists()) dir.mkdirs();

            String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            File dest = new File(dir, uniqueFileName);
            imageFile.transferTo(dest);

            return IMAGE_BASE_URL + uniqueFileName; // frontend can fetch this
        } catch (Exception e) {
            throw new RuntimeException("Error saving image: " + e.getMessage());
        }
    }

    private void deleteImageFile(String imageUrl) {
        if (imageUrl != null && !imageUrl.isEmpty()) {
            try {
                String fileName = imageUrl.replace(IMAGE_BASE_URL, "");
                File file = new File(IMAGE_DIRECTORY, fileName);
                if (file.exists()) file.delete();
            } catch (Exception e) {
                System.err.println("Failed to delete image: " + e.getMessage());
            }
        }
    }

    private ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getId());
        dto.setName(product.getName());
        dto.setSku(product.getSku());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setDescription(product.getDescription());
        dto.setImageUrl(product.getImageUrl());
        dto.setExpiryDate(product.getExpiryDate());
        if (product.getCategory() != null) dto.setCategoryId(product.getCategory().getId());
        dto.setCreatedAt(product.getCreatedAt());
        return dto;
    }
}
