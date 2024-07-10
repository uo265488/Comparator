package com.api.rest_api.controllers.product;

import co.elastic.clients.elasticsearch._types.Result;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.services.product.ProductIndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/products/index")
public class ProductIndexController {

    @Autowired
    private ProductIndexService productIndexService;

    @PostMapping
    public ResponseEntity<String> indexProduct(@RequestBody Product product) {
        IndexResponse response = productIndexService.indexDocument(product);

        return response.result().equals(Result.Created)
                ? ResponseEntity.status(HttpStatus.CREATED).body(response.id())
                : ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PostMapping("createIndex")
    public ResponseEntity<Void> createIndex() {
        boolean success = productIndexService.createIndex();

        return success
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.internalServerError().build();
    }

    @PostMapping("bulk")
    public ResponseEntity<Void> bulkIndexing(@RequestParam("file") MultipartFile products) {

        boolean success = productIndexService.synchronousBulkIndexingProducts(products);

        return success
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
