package com.pravallika.InventoryMgtSystem.services;

import org.springframework.web.multipart.MultipartFile;
import com.pravallika.InventoryMgtSystem.dtos.ProductDTO;
import com.pravallika.InventoryMgtSystem.dtos.Response;
import java.util.List;

public interface ProductService {

    Response saveProduct(ProductDTO productDTO, MultipartFile imageFile);

    Response updateProduct(ProductDTO productDTO, MultipartFile imageFile);

    Response getAllProducts();

    Response getProductById(Long id);

    Response deleteProduct(Long id);

    Response searchProduct(String input);

    Response reduceStock(Long productId, Integer quantity);

    // For CSV export
    List<ProductDTO> getAllProductsDTO();
}
