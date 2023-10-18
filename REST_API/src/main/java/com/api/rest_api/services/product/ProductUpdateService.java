package com.api.rest_api.services.product;

import co.elastic.clients.elasticsearch.core.UpdateResponse;
import com.api.rest_api.documents.Product;
import com.api.rest_api.repositories.update.UpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductUpdateService {

    @Autowired
    private UpdateRepository<Product> productUpdateRepository;

    public UpdateResponse<Product> updateDocument(Product product) {
        return productUpdateRepository.update(product);
    }
}
