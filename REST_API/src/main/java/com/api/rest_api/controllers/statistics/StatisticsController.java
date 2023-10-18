package com.api.rest_api.controllers.statistics;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.Product;
import com.api.rest_api.services.product.ProductSearchService;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {
    @Autowired
    private ProductSearchService service;

    private static final Logger logger = LoggerFactory.getLogger("Logger");

    @GetMapping("/avgPriceBySupermercado")
    public ResponseEntity<Object> getAvgPriceBySupermercado() {

        SearchResponse<Product> response = service.getAveragePricesBySupermercado();

        Gson gson = new Gson();
        String json = gson.toJson(response.aggregations());

        return ResponseEntity.ok(json);
    }

    @GetMapping("/avgPricePerMonthBySupermercado")
    public ResponseEntity<Object> getAvgPricePerMonthBySupermercado() {
        return ResponseEntity.ok(service.getAvgPricePerMonthBySupermercado());
    }

}
