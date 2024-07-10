package com.api.rest_api.documents.requestModels;

import com.api.rest_api.documents.domain.LaListaProduct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AddListaRequest {
    private String email;
    private String listName;
    private List<LaListaProduct> productList;
    private Double precioTotal;
}

