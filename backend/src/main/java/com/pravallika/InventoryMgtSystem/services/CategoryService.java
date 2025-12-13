package com.pravallika.InventoryMgtSystem.services;

import com.pravallika.InventoryMgtSystem.dtos.CategoryDTO;
import com.pravallika.InventoryMgtSystem.dtos.Response;

public interface CategoryService {

    Response createCategory(CategoryDTO categoryDTO);

    Response getAllCategories();

    Response getCategoryById(Long id);

    Response updateCategory(Long id, CategoryDTO categoryDTO);

    Response deleteCategory(Long id);
}
