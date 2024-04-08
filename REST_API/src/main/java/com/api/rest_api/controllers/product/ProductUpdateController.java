package com.api.rest_api.controllers.product;

import co.elastic.clients.elasticsearch.core.UpdateResponse;
import com.api.rest_api.documents.Product;
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
    @PutMapping("product")
    public ResponseEntity<UpdateResponse<Product>> update(@RequestBody Product product) {
        return ResponseEntity.ok(updateService.updateDocument(product));
    }
}
