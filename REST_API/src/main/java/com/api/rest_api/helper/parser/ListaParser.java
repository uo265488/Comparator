package com.api.rest_api.helper.parser;

import com.api.rest_api.documents.domain.LaListaProduct;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ListaParser {
    public static LaListaProduct mapToLista(Object obj) {
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString = null;
        LaListaProduct laListaProduct = null;
        try {
            jsonString = objectMapper.writeValueAsString(obj);
            laListaProduct = objectMapper.readValue(jsonString, LaListaProduct.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return laListaProduct;
    }

}
