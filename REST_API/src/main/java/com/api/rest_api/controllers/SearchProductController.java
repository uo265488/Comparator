package com.api.rest_api.controllers;

import com.api.rest_api.documents.ResponseModel;
import com.api.rest_api.services.ProductSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search")
public class SearchProductController {
    @Autowired
    private ProductSearchService service;

    @Operation(summary = "Match all query")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success. "),
            @ApiResponse(responseCode = "400", description = "Bad request. ")
    })
    //@Parameters(value = {    })
    @GetMapping("/all")
    public ResponseEntity<ResponseModel> matchAllQuery() {
        //return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        return ResponseEntity.ok(service.matchAllQuery());
    }

}
