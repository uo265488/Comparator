package com.api.rest_api.documents;

import lombok.*;
@ToString
@Getter
@Builder
public class LaListaProduct {
    String productBarcode;
    String productSupermercado;
    @Setter String listaId;

}
