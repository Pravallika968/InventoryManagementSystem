package com.pravallika.InventoryMgtSystem.services;

import com.pravallika.InventoryMgtSystem.dtos.Response;
import com.pravallika.InventoryMgtSystem.dtos.TransactionRequest;
import com.pravallika.InventoryMgtSystem.enums.TransactionStatus;

public interface TransactionService {
    Response purchase(TransactionRequest transactionRequest);

    Response sell(TransactionRequest transactionRequest);

    Response returnToSupplier(TransactionRequest transactionRequest);

    Response getAllTransactions(int page, int size, String filter);

    Response getAllTransactionById(Long id);

    Response getAllTransactionByMonthAndYear(int month, int year);

    Response updateTransactionStatus(Long transactionId, TransactionStatus status);
}
