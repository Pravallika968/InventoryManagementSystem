package com.pravallika.InventoryMgtSystem.services.impl;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.pravallika.InventoryMgtSystem.dtos.CategoryDTO;
import com.pravallika.InventoryMgtSystem.dtos.ProductDTO;
import com.pravallika.InventoryMgtSystem.dtos.Response;
import com.pravallika.InventoryMgtSystem.exceptions.NotFoundException;
import com.pravallika.InventoryMgtSystem.models.Category;
import com.pravallika.InventoryMgtSystem.repositories.CategoryRepository;
import com.pravallika.InventoryMgtSystem.services.CategoryService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;


    @Override
    public Response createCategory(CategoryDTO categoryDTO) {

        Category categoryToSave = modelMapper.map(categoryDTO, Category.class);

        categoryRepository.save(categoryToSave);

        return Response.builder()
                .status(200)
                .message("Category Saved Successfully")
                .build();

    }

    @Override
    public Response getAllCategories() {
        // List<Category> categories = categoryRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

        // categories.forEach(category -> category.setProducts(null));

        // List<CategoryDTO> categoryDTOList = modelMapper.map(categories, new TypeToken<List<CategoryDTO>>() {
        // }.getType());

        // return Response.builder()
        //         .status(200)
        //         .message("success")
        //         .categories(categoryDTOList)
        //         .build();

              // Step 1: Fetch only non-deleted categories (null-safe)
    List<Category> categoryList = categoryRepository.findByIsDeletedFalse();

    // Step 2: Map categories to DTOs
    List<CategoryDTO> categoryDTOList = categoryList.stream().map(category -> {
        CategoryDTO dto = modelMapper.map(category, CategoryDTO.class);

        // Step 3: Map only non-deleted products (null-safe)
        List<ProductDTO> productDTOs = category.getProducts().stream()
                .filter(p -> p.getIsDeleted() == null || !p.getIsDeleted()) // null-safe check
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .toList();

        dto.setProducts(productDTOs); // attach products to category DTO
        return dto;
    }).toList();

    // Step 4: Return response
    return Response.builder()
            .status(200)
            .message("success")
            .categories(categoryDTOList)
            .build();


    }

    @Override
    public Response getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));

        CategoryDTO categoryDTO = modelMapper.map(category, CategoryDTO.class);

        return Response.builder()
                .status(200)
                .message("success")
                .category(categoryDTO)
                .build();
    }

    @Override
    public Response updateCategory(Long id, CategoryDTO categoryDTO) {

        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));

        existingCategory.setName(categoryDTO.getName());

        categoryRepository.save(existingCategory);

        return Response.builder()
                .status(200)
                .message("Category Was Successfully Updated")
                .build();

    }

    @Override
    public Response deleteCategory(Long id) {

        // categoryRepository.findById(id)
        //         .orElseThrow(() -> new NotFoundException("Category Not Found"));

        // categoryRepository.deleteById(id);

        // return Response.builder()
        //         .status(200)
        //         .message("Category Was Successfully Deleted")
        //         .build();


            Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Category Not Found"));

    category.setIsDeleted(true); // soft delete

    categoryRepository.save(category);

    return Response.builder()
            .status(200)
            .message("Category deleted successfully")
            .build();

    }
}
