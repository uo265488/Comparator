package com.api.rest_api.helper.parser;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.api.rest_api.documents.Product;
import com.api.rest_api.helper.exceptions.NotYetImplementedException;
import io.micrometer.core.instrument.search.Search;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProductParser {

    public List<Product> parseProducts(int prods) {
        throw new NotYetImplementedException();
    }

    public ProductParser(MultipartFile file) {
        throw new NotYetImplementedException();
    }

    public static Product mapToProduct(Object obj) {
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString = null;
        Product product = null;
        try {
            jsonString = objectMapper.writeValueAsString(obj);
            product = objectMapper.readValue(jsonString, Product.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return product;
    }

    public static Map<String, Map<String, Double>> searchResponseToStatistic(SearchResponse<Product> response) {


        Map<String, Map<String, Double>> statistics = new HashMap<>();
        Map<String, Map<String, Integer>> counter = new HashMap<>();

        for (Hit<Product> hit : response.hits().hits()) {
            String supermercado = ProductParser.mapToProduct(hit.source()).getSupermercado();

            if (!statistics.containsKey(supermercado)) {
                statistics.put(supermercado, new HashMap<>());
                counter.put(supermercado, new HashMap<>());
            }

            Map<String, Double> supermercadoMap = statistics.get(supermercado);
            Map<String, Integer> counterMap = counter.get(supermercado);
            String[] fechasDeRegistro = ProductParser.mapToProduct(hit.source()).getFechas_de_registro();
            double[] precios = ProductParser.mapToProduct(hit.source()).getPrecios();

            for (int i = 0; i < fechasDeRegistro.length; i++) {
                String fechaDeRegistro = fechasDeRegistro[i];
                double precio = precios[i];

                LocalDate date = LocalDate.parse(fechaDeRegistro, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

                String month = date.format(DateTimeFormatter.ofPattern("MMMM yyyy"));

                if (!supermercadoMap.containsKey(month)) {
                    supermercadoMap.put(month, 0.0);
                    counterMap.put(month, 0);
                }

                double currentAverage = supermercadoMap.get(month);
                int currentCounter = counterMap.get(month);
                double newAverage = (currentAverage * currentCounter + precio) / (currentCounter + 1);
                supermercadoMap.put(month, newAverage);
                counterMap.put(month, currentCounter);
            }
        }
        return statistics;
    }
}

