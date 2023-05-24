package com.api.rest_api.controllers;

import com.api.rest_api.documents.Product;
import com.api.rest_api.documents.ResponseModel;
import com.api.rest_api.helper.parser.ProductParser;
import com.api.rest_api.services.ProductSearchService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/filter")
    public ResponseEntity<ResponseModel> filterBy(@RequestParam("nombre") Optional<String> nombre,
                                                  @RequestParam("marca") Optional<String> marca,
                                                  @RequestParam("precio") Optional<Double> precio,
                                                  @RequestParam("supermercado") Optional<String> supermercado,
                                                  @RequestParam("proveedor") Optional<String> proveedor,
                                                  @RequestParam("barcode") Optional<String> barcode,
                                                  @RequestParam("fecha_de_registro") Optional<String> fecha_de_registro) {

        return ResponseEntity.ok(
                service.basicFiltering(nombre, marca, supermercado, proveedor, barcode));
    }

    @PostMapping("laLista/mejorar")
    public ResponseEntity<ResponseModel> optimizeList(@RequestBody List<Product> laLista) {

        ResponseEntity<ResponseModel> res = ResponseEntity.ok(service.optimizeList(laLista));
        System.out.println(res);
        return res;
    }

    @SneakyThrows
    @PostMapping("producto/alternativa")
    public ResponseEntity<ResponseModel> findBestAlternative(@RequestBody Product product,
                                                             @RequestParam("supermercado") Optional<String> supermercado) {
        /*ResponseModel responseModel = service.findProductByBarcode(barcode);
        if(responseModel.getHits().size() > 0) {
            return ResponseEntity.ok(service.findBestAlternative(responseModel.getHits().get(0), supermercado));
        }
        return ResponseEntity.status(HttpStatusCode.valueOf(HttpStatus.NOT_FOUND.value())).build();*/
        System.out.println(product);
        System.out.println(supermercado);
        ResponseModel res = service.findBestAlternative(product, supermercado);
        System.out.println(res);
        return ResponseEntity.ok(res);
    }

}
