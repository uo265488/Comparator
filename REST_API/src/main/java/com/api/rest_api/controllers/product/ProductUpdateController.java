package com.api.rest_api.controllers.product;

import co.elastic.clients.elasticsearch._types.Result;
import co.elastic.clients.elasticsearch.core.UpdateResponse;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.services.product.ProductUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products/update")
public class ProductUpdateController {

    @Autowired
    private ProductUpdateService updateService;

    @CrossOrigin(origins = "*")
    @PutMapping
    public ResponseEntity<Product> update(@RequestBody Product product) {
        UpdateResponse<Product> response = updateService.updateDocument(product);

        return response.result().equals(Result.Updated)
                ? ResponseEntity.ok(response.get().source())
                : ResponseEntity.badRequest().build();
    }
}
