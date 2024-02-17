package com.api.rest_api.controllers.product;

import com.api.rest_api.documents.Product;
import com.api.rest_api.documents.responseModels.ProductResponseModel;
import com.api.rest_api.helper.exceptions.ControllerException;
import com.api.rest_api.services.product.ProductSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/search")
public class SearchProductController {
    @Autowired
    private ProductSearchService service;

    private static final Logger logger = LoggerFactory.getLogger("Logger");


    @Operation(summary = "Match all query")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success. "),
            @ApiResponse(responseCode = "400", description = "Bad request. ")
    })
    //@Parameters(value = {    })
    @GetMapping("/all")
    public ResponseEntity<ProductResponseModel> matchAllQuery() {
        return ResponseEntity.ok(service.matchAllQuery());
    }

    @GetMapping("/filter")
    public ResponseEntity<ProductResponseModel> filterBy(@RequestParam("nombre") Optional<String> nombre,
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
    public ResponseEntity<ProductResponseModel> optimizeList(@RequestBody List<Product> laLista) {

        ResponseEntity<ProductResponseModel> res = ResponseEntity.ok(service.optimizeList(laLista));
        System.out.println(res);
        return res;
    }

    @SneakyThrows
    @PostMapping("producto/alternativa")
    public ResponseEntity<ProductResponseModel> findBestAlternative(@RequestBody Product product,
                                                                    @RequestParam("supermercado") Optional<String> supermercado,
                                                                    @RequestParam("marca") Optional<String> marca) {

        if(product.getBarcode() == null || product.getBarcode().isEmpty() || product.getBarcode().isBlank()) {
            throw new ControllerException("Product received in RequestBody cannot be null, blank nor empty. ");
        }
        ProductResponseModel res = service.findBestAlternative(product, supermercado, marca);
        logger.info(res.toString());
        return ResponseEntity.ok(res);
    }

    @GetMapping("product/mostUpdated")
    public ResponseEntity<ProductResponseModel> getMostUpdatedProduct() {

        ProductResponseModel res = service.getMostUpdated();
        logger.info(res.toString());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/marcas")
    public ResponseEntity<ProductResponseModel> getAllMarcas() {
        return ResponseEntity.ok(service.getAllMarcas());
    }

    @GetMapping("/lastPriceChange")
    public ResponseEntity<ProductResponseModel> getMostRecentUpdate() {

        return ResponseEntity.ok(service.mostRecentUpdate());
    }

}
