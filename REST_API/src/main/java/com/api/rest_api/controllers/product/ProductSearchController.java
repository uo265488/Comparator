package com.api.rest_api.controllers.product;

import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.documents.responseModels.ProductResponseModel;
import com.api.rest_api.helper.exceptions.ControllerException;
import com.api.rest_api.services.product.ProductSearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/products/search")
public class ProductSearchController {

    @Autowired
    private ProductSearchService productSearchService;

    private static final Logger logger = LoggerFactory.getLogger("Logger");

    @GetMapping
    public ResponseEntity<ProductResponseModel> findAll() {
        return ResponseEntity.ok(productSearchService.findAll());
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
                productSearchService.filter(nombre, marca, supermercado, proveedor, barcode));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> findById(@PathVariable("id") final String id) {
        return ResponseEntity.ok(productSearchService.findById(id));
    }

    @PostMapping("/improve")
    public ResponseEntity<ProductResponseModel> findBestAlternative(@RequestBody Product product,
                                                                    @RequestParam("supermercado") Optional<String> supermercado,
                                                                    @RequestParam("marca") Optional<String> marca) {

        if(product.getBarcode() == null || product.getBarcode().isEmpty() || product.getBarcode().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        ProductResponseModel res = productSearchService.findBestAlternative(product, supermercado, marca);
        logger.info(res.toString());

        return ResponseEntity.ok(res);
    }

    @PostMapping("/compare")
    public ResponseEntity<ProductResponseModel> compareProduct(@RequestBody Product product) {

        if(product.getBarcode() == null || product.getBarcode().isEmpty() || product.getBarcode().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        ProductResponseModel res = productSearchService.compareProduct(product);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/improveLaLista")
    public ResponseEntity<ProductResponseModel> optimizeList(@RequestBody List<Product> laLista) {

        return ResponseEntity.ok(productSearchService.optimizeList(laLista));
    }

    @GetMapping("/marcas")
    public ResponseEntity<ProductResponseModel> getAllMarcas() {
        return ResponseEntity.ok(productSearchService.getAllMarcas());
    }
}
