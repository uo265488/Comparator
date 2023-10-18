package com.api.rest_api.helper.parser;

import com.api.rest_api.documents.Lista;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ListaParser {
    public static Lista mapToLista(Object obj) {
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString = null;
        Lista lista = null;
        try {
            jsonString = objectMapper.writeValueAsString(obj);
            lista = objectMapper.readValue(jsonString, Lista.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return lista;
    }

}
