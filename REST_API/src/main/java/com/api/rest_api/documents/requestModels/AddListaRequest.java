package com.api.rest_api.documents.requestModels;

import com.api.rest_api.documents.LaListaProduct;
import lombok.Getter;

import java.util.List;

@Getter
public class AddListaRequest {
    private List<LaListaProduct> productList;
    private String email;
    private String listName;
}

