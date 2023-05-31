package com.api.rest_api.helper.parser;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.api.rest_api.documents.Product;
import com.api.rest_api.helper.exceptions.NotYetImplementedException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
}
