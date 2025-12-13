package com.pravallika.InventoryMgtSystem.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.pravallika.InventoryMgtSystem.dtos.ProductDTO;
import com.pravallika.InventoryMgtSystem.dtos.Response;
import com.pravallika.InventoryMgtSystem.services.ProductService;

import java.io.PrintWriter;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    // ✅ Manual constructor instead of @RequiredArgsConstructor
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> saveProduct(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam("name") String name,
            @RequestParam("sku") String sku,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "description", required = false) String description
    ) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName(name);
        productDTO.setSku(sku);
        productDTO.setPrice(price);
        productDTO.setStockQuantity(stockQuantity);
        productDTO.setCategoryId(categoryId);
        productDTO.setDescription(description);

        return ResponseEntity.ok(productService.saveProduct(productDTO, imageFile));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateProduct(
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "stockQuantity", required = false) Integer stockQuantity,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("productId") Long productId
    ) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName(name);
        productDTO.setSku(sku);
        productDTO.setPrice(price);
        productDTO.setProductId(productId);
        productDTO.setStockQuantity(stockQuantity);
        productDTO.setCategoryId(categoryId);
        productDTO.setDescription(description);

        return ResponseEntity.ok(productService.updateProduct(productDTO, imageFile));
    }

    @GetMapping("/all")
    public ResponseEntity<Response> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.deleteProduct(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Response> searchProduct(@RequestParam String input) {
        return ResponseEntity.ok(productService.searchProduct(input));
    }
    @PutMapping("/{id}/reduceStock")
    public ResponseEntity<Response> reduceStock(
        @PathVariable Long id,
        @RequestParam Integer quantity) {
        return ResponseEntity.ok(productService.reduceStock(id, quantity));
    }
    @GetMapping("/download/csv")
    public ResponseEntity<byte[]> downloadProductsCSV() {
        List<ProductDTO> products = productService.getAllProductsDTO(); // create this in service

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PrintWriter writer = new PrintWriter(baos)) {

            // CSV header
            writer.println("Product ID,Name,SKU,Price,Stock Quantity,Category,Description,Expiry Date");

            // CSV rows
            for (ProductDTO p : products) {
                String categoryName = p.getCategoryId() != null ? p.getCategoryId().toString() : "";
                String description = p.getDescription() != null ? p.getDescription().replace(",", ";") : "";
                String expiry = p.getExpiryDate() != null ? p.getExpiryDate().toString() : "";

                writer.printf("%d,%s,%s,%.2f,%d,%s,%s,%s%n",
                        p.getProductId(),
                        p.getName(),
                        p.getSku(),
                        p.getPrice(),
                        p.getStockQuantity(),
                        categoryName,
                        description,
                        expiry
                );
            }
            writer.flush();

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=products.csv");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(baos.toByteArray());

        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}

