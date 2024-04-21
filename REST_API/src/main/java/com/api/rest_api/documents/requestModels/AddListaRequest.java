package com.api.rest_api.documents.requestModels;

import com.api.rest_api.documents.domain.LaListaProduct;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class AddListaRequest {
    private String email;
    private String listName;
    private List<LaListaProduct> productList;
}

