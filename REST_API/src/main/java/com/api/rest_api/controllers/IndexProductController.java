package com.api.rest_api.controllers;

import com.api.rest_api.documents.Product;
import com.api.rest_api.services.ProductIndexService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/index")
public class IndexProductController {

    @Autowired
    private ProductIndexService service;

    @Operation(summary = "Product's bulk indexing")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Success. "),
            @ApiResponse(responseCode = "500", description = "Error indexing products. ")
    })
    @Parameters(value = {
            @Parameter(name = "products", required = true, description = "products.tsv")
    })
    @PostMapping("bulk")
    public ResponseEntity bulkIndexing(@RequestParam("file") MultipartFile products) {

        boolean success = service.synchronousBulkIndexingProducts(products);

        return success
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    /**
     * Indexing a product document in the product index
     */
    @PostMapping("/product")
    public ResponseEntity<String> indexProduct(@RequestBody Product product) {
        System.out.println(product);
        return ResponseEntity.ok(service.indexDocument(product));
    }

    @Operation(summary = "Create the Product index")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Success. "),
            @ApiResponse(responseCode = "500", description = "Not created. ")
    })
    @PostMapping("create")
    public ResponseEntity createIndex() {
        boolean success = service.createIndex();

        return success
                ? ResponseEntity.created(ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/products")
                .buildAndExpand().toUri()).build()
                : ResponseEntity.internalServerError().build();
    }
}
