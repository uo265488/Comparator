package com.api.rest_api.documents.responseModels;

import com.api.rest_api.documents.LaListaProduct;
import com.api.rest_api.documents.Lista;
import lombok.Builder;

import java.util.List;

@Builder
public class LaListaResponseModel {
    private Lista lista;
    private List<LaListaProduct> laListaProductsList;
}
