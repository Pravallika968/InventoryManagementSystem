package com.pravallika.InventoryMgtSystem.services.impl;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.pravallika.InventoryMgtSystem.dtos.Response;
import com.pravallika.InventoryMgtSystem.dtos.SupplierDTO;
import com.pravallika.InventoryMgtSystem.exceptions.NotFoundException;
import com.pravallika.InventoryMgtSystem.models.Supplier;
import com.pravallika.InventoryMgtSystem.repositories.SupplierRepository;
import com.pravallika.InventoryMgtSystem.services.SupplierService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupplierServiceImpl implements SupplierService {


    private final SupplierRepository supplierRepository;
    private final ModelMapper modelMapper;


    @Override
    public Response addSupplier(SupplierDTO supplierDTO) {

        Supplier supplierToSave = modelMapper.map(supplierDTO, Supplier.class);

        supplierRepository.save(supplierToSave);

        return Response.builder()
                .status(200)
                .message("Supplier Saved Successfully")
                .build();
    }

    @Override
    public Response updateSupplier(Long id, SupplierDTO supplierDTO) {

        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

        if (supplierDTO.getName() != null) existingSupplier.setName(supplierDTO.getName());
        if (supplierDTO.getContactInfo() != null) existingSupplier.setContactInfo(supplierDTO.getContactInfo());
        if (supplierDTO.getAddress() != null) existingSupplier.setAddress(supplierDTO.getAddress());

        supplierRepository.save(existingSupplier);

        return Response.builder()
                .status(200)
                .message("Supplier Was Successfully Updated")
                .build();
    }

    @Override
    public Response getAllSupplier() {

        // List<Supplier> suppliers = supplierRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

        // List<SupplierDTO> supplierDTOList = modelMapper.map(suppliers, new TypeToken<List<SupplierDTO>>() {
        // }.getType());

        // return Response.builder()
        //         .status(200)
        //         .message("success")
        //         .suppliers(supplierDTOList)
        //         .build();


          List<Supplier> supplierList = supplierRepository.findByIsDeletedFalse();

    // Map entities to DTOs
    List<SupplierDTO> supplierDTOList = modelMapper.map(
            supplierList,
            new TypeToken<List<SupplierDTO>>() {}.getType()
    );

    return Response.builder()
            .status(200)
            .message("success")
            .suppliers(supplierDTOList) // DTO list goes to response
            .build();
    }

    @Override
    public Response getSupplierById(Long id) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

        SupplierDTO supplierDTO = modelMapper.map(supplier, SupplierDTO.class);

        return Response.builder()
                .status(200)
                .message("success")
                .supplier(supplierDTO)
                .build();
    }

    @Override
    public Response deleteSupplier(Long id) {

        // supplierRepository.findById(id)
        //         .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

        // supplierRepository.deleteById(id);

        // return Response.builder()
        //         .status(200)
        //         .message("Supplier Was Successfully Deleted")
        //         .build();

         Supplier supplier = supplierRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

    supplier.setIsDeleted(true); // soft delete

    supplierRepository.save(supplier);

    return Response.builder()
            .status(200)
            .message("Supplier deleted successfully")
            .build();
    }
}
